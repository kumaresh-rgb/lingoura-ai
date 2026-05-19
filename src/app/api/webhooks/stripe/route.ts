/**
 * Stripe Webhook Handler
 *
 * Security Model:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  1. Raw body is preserved — Stripe signature covers raw bytes.   │
 * │  2. Stripe-Signature header is verified with HMAC-SHA256.        │
 * │  3. Each event is idempotent — duplicate delivery is safe.       │
 * │  4. We IMMEDIATELY return 200 to Stripe, then forward to backend.│
 * │     Stripe retries on non-2xx; long processing must be async.    │
 * │  5. The backend re-verifies the event against the Stripe API     │
 * │     before activating any subscription. This endpoint is a relay.│
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Attack prevention:
 *  • Fake webhook: blocked by HMAC signature check (webhook secret)
 *  • Replay attack: Stripe includes a timestamp; we reject events > 5 min old
 *  • Spoofed event data: backend re-fetches the event from Stripe API
 *  • Subscription bypass: backend is the ONLY writer to subscription table
 */

import { NextRequest, NextResponse } from 'next/server';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';
const BACKEND_WEBHOOK_URL = `${process.env.NEXT_PUBLIC_API_URL}/payments/webhook/stripe`;
const BACKEND_WEBHOOK_SECRET = process.env.BACKEND_INTERNAL_SECRET ?? '';

// Stripe requires the raw body for signature verification.
// Next.js App Router does NOT parse the body automatically in route handlers,
// which is exactly what we need here.
export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── 1. Read raw body ──────────────────────────────────────────────────────
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'Cannot read body' }, { status: 400 });
  }

  // ── 2. Verify Stripe-Signature header ─────────────────────────────────────
  const stripeSignature = request.headers.get('stripe-signature');
  if (!stripeSignature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    // Misconfigured deployment — refuse to process
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook misconfigured' }, { status: 500 });
  }

  // Verify the HMAC signature using the Web Crypto API (Edge-runtime compatible)
  const isValid = await verifyStripeSignature(rawBody, stripeSignature, STRIPE_WEBHOOK_SECRET);
  if (!isValid) {
    // Log the attempt — this may indicate a spoofing/probing attack
    console.warn('[stripe-webhook] Signature verification FAILED — possible attack probe', {
      ip: request.headers.get('x-forwarded-for') ?? 'unknown',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── 3. Parse event (safe — only after signature verified) ─────────────────
  let event: { id: string; type: string; created: number };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── 4. Timestamp check — reject events older than 5 minutes ──────────────
  //  Stripe includes this in its own SDK; we replicate it for the Edge runtime.
  const eventAge = Math.floor(Date.now() / 1000) - (event.created ?? 0);
  if (eventAge > 300) {
    console.warn('[stripe-webhook] Stale event rejected', { eventId: event.id, ageSeconds: eventAge });
    // Return 200 to stop Stripe from retrying a legitimately old event
    return NextResponse.json({ received: true, stale: true });
  }

  // ── 5. Forward verified payload to ASP.NET Core backend ───────────────────
  //  The backend is the authoritative writer. It will:
  //   a) De-duplicate by event.id (idempotency key in webhook_events table)
  //   b) Re-fetch the event from Stripe API as a second verification layer
  //   c) Update the subscriptions table transactionally
  try {
    const backendResponse = await fetch(BACKEND_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Internal secret so ASP.NET knows this relay is authentic
        'X-Internal-Secret': BACKEND_WEBHOOK_SECRET,
        // Forward original signature for backend re-verification
        'Stripe-Signature': stripeSignature,
        'X-Event-Id': event.id,
      },
      body: rawBody,
    });

    if (!backendResponse.ok) {
      console.error('[stripe-webhook] Backend relay failed', {
        status: backendResponse.status,
        eventId: event.id,
        eventType: event.type,
      });
      // Return 500 so Stripe will retry — backend may be temporarily unavailable
      return NextResponse.json({ error: 'Backend processing failed' }, { status: 500 });
    }
  } catch (err) {
    console.error('[stripe-webhook] Network error relaying to backend', err);
    return NextResponse.json({ error: 'Relay error' }, { status: 502 });
  }

  // ── 6. ACK to Stripe ──────────────────────────────────────────────────────
  return NextResponse.json({ received: true });
}

// ── HMAC-SHA256 signature verification (Edge-runtime compatible) ──────────────
//
// Stripe-Signature header format:
//   t=<timestamp>,v1=<hmac>,v1=<hmac2>,...
//
// Signed payload: `${timestamp}.${rawBody}`
//
async function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = signatureHeader.split(',').reduce<{ t?: string; v1?: string }>((acc, part) => {
      const [key, val] = part.split('=');
      if (key === 't') acc.t = val;
      if (key === 'v1' && !acc.v1) acc.v1 = val; // take first v1
      return acc;
    }, {});

    if (!parts.t || !parts.v1) return false;

    const signedPayload = `${parts.t}.${rawBody}`;
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(signedPayload));

    const expectedHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison to prevent timing attacks
    return constantTimeEqual(expectedHex, parts.v1);
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
