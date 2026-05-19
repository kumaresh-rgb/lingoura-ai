/**
 * Payment region detection.
 *
 * Security note: This is a HINT only. The backend independently determines
 * the payment provider using server-side geo-IP (MaxMind / Azure IP lookup).
 * Clients cannot force a different provider by spoofing this value.
 */

import type { PaymentProvider } from '../types/billing.types';

// ISO 3166-1 alpha-2 country codes routed to Razorpay (INR billing).
const RAZORPAY_COUNTRIES = new Set(['IN']);

/**
 * Returns the provider hint based on the browser's locale/timezone.
 * Falls back to Stripe if detection is ambiguous.
 *
 * The REAL enforcement lives in the backend geo-IP check.
 */
export function detectPaymentProvider(): PaymentProvider {
  try {
    // Intl.Locale gives us the region from the browser's locale
    const locale = new Intl.Locale(navigator.language);
    const region = locale.region ?? '';
    if (RAZORPAY_COUNTRIES.has(region.toUpperCase())) return 'razorpay';

    // Timezone cross-check — IST zones start with Asia/Kolkata
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'razorpay';
  } catch {
    // SSR or environments without Intl — safe default
  }
  return 'stripe';
}

/**
 * Loads and opens the Razorpay Checkout modal.
 *
 * IMPORTANT: The frontend NEVER processes the payment result as authoritative.
 * All it does is display a confirmation UI. The backend webhook is the
 * authoritative signal that activates the subscription.
 *
 * The razorpay_payment_id / razorpay_signature from the success callback are
 * forwarded to the backend for server-side HMAC verification — they are
 * NEVER trusted directly by the frontend.
 */
type RazorpayWindow = Window & { Razorpay?: new (opts: Record<string, unknown>) => { open(): void } };

function ensureRazorpayScript(callback: () => void): void {
  const w = window as RazorpayWindow;
  if (w.Razorpay) { callback(); return; }
  if (document.getElementById('razorpay-sdk')) {
    // Script tag exists but not yet loaded — wait for it
    document.getElementById('razorpay-sdk')!.addEventListener('load', callback, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.id = 'razorpay-sdk';
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = callback;
  script.onerror = () => console.error('[payment] Failed to load Razorpay SDK');
  document.head.appendChild(script);
}

export function openRazorpayCheckout(options: {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  userName: string;
  userEmail: string;
  description: string;
  onSuccess: (payload: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  onDismiss: () => void;
}): void {
  ensureRazorpayScript(() => _openRazorpayModal(options));
}

function _openRazorpayModal(options: Parameters<typeof openRazorpayCheckout>[0]): void {
  const { orderId, amount, currency, keyId, userName, userEmail, description, onSuccess, onDismiss } = options;

  const RazorpayConstructor = (window as RazorpayWindow).Razorpay;

  if (!RazorpayConstructor) {
    console.error('[payment] Razorpay SDK not loaded');
    return;
  }

  const rzp = new RazorpayConstructor({
    key: keyId,
    order_id: orderId,
    amount,
    currency,
    name: 'Lingoura AI',
    description,
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: { color: '#6366f1' },
    handler: onSuccess,
    modal: {
      ondismiss: onDismiss,
      escape: false,
      // Keep modal open on failure so user can try another payment method
      confirm_close: true,
    },
    // Allow user to retry with a different card/UPI if first attempt fails
    retry: { enabled: true, max_count: 3 },
  });

  rzp.open();
}
