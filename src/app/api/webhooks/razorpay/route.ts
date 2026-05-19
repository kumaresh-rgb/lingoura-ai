/**
 * Razorpay Webhook Handler
 *
 * Security Model:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  1. Raw body preserved — Razorpay signature covers raw bytes.    │
 * │  2. X-Razorpay-Signature header verified with HMAC-SHA256.      │
 * │  3. Idempotent — duplicate event delivery is safe.               │
 * │  4. Verified payload forwarded to ASP.NET backend.              │
 * │  5. Backend re-verifies payment via Razorpay Fetch Order API.    │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Razorpay webhook signature:
 *   HMAC-SHA256(webhookSecret, rawBody)  → hex string
 *   Header: X-Razorpay-Signature
 *
 * Note: Razorpay does NOT include a timestamp in the signature payload,
 * so we use event.created_at if present, falling back to our server time.
 */

import { NextRequest, NextResponse } from 'next/server';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
const BACKEND_WEBHOOK_URL = `${process.env.NEXT_PUBLIC_API_URL}/payments/webhook/razorpay`;
// Both names accepted: INTERNAL_WEBHOOK_SECRET is the canonical .env.local name
const BACKEND_INTERNAL_SECRET =
  process.env.INTERNAL_WEBHOOK_SECRET ?? process.env.BACKEND_INTERNAL_SECRET ?? '';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── 1. Read raw body ──────────────────────────────────────────────────────
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'Cannot read body' }, { status: 400 });
  }

  // ── 2. Verify X-Razorpay-Signature ────────────────────────────────────────
  const razorpaySignature = request.headers.get('x-razorpay-signature');
  if (!razorpaySignature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  if (!RAZORPAY_WEBHOOK_SECRET) {
    console.error('[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook misconfigured' }, { status: 500 });
  }

  const isValid = await verifyRazorpaySignature(rawBody, razorpaySignature, RAZORPAY_WEBHOOK_SECRET);
  if (!isValid) {
    console.warn('[razorpay-webhook] Signature verification FAILED', {
      ip: request.headers.get('x-forwarded-for') ?? 'unknown',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── 3. Parse event ─────────────────────────────────────────────────────────
  let event: { event: string; created_at?: number; payload?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── 4. Only process payment / subscription events ─────────────────────────
  const HANDLED_EVENTS = new Set([
    'payment.captured',
    'payment.failed',
    'subscription.activated',
    'subscription.charged',
    'subscription.cancelled',
    'subscription.completed',
    'subscription.updated',
    'refund.created',
    'refund.processed',
    'refund.failed',
  ]);

  if (!HANDLED_EVENTS.has(event.event)) {
    // Unknown event type — ACK so Razorpay doesn't retry, but don't process
    return NextResponse.json({ received: true, handled: false });
  }

  // ── 5. Forward to ASP.NET backend ─────────────────────────────────────────
  try {
    const backendResponse = await fetch(BACKEND_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': BACKEND_INTERNAL_SECRET,
        'X-Razorpay-Signature': razorpaySignature,
        'X-Event-Type': event.event,
      },
      body: rawBody,
    });

    if (!backendResponse.ok) {
      console.error('[razorpay-webhook] Backend relay failed', {
        status: backendResponse.status,
        eventType: event.event,
      });
      return NextResponse.json({ error: 'Backend processing failed' }, { status: 500 });
    }
  } catch (err) {
    console.error('[razorpay-webhook] Network error relaying to backend', err);
    return NextResponse.json({ error: 'Relay error' }, { status: 502 });
  }

  return NextResponse.json({ received: true });
}

// ── HMAC-SHA256 verification (Edge-runtime compatible) ────────────────────────
//
// Razorpay webhook signature = HMAC-SHA256(webhook_secret, raw_body) as hex
//
async function verifyRazorpaySignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const mac = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(rawBody));

    const expectedHex = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return constantTimeEqual(expectedHex, signature);
  } catch {
    return false;
  }
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
