import type { NextConfig } from 'next';

// Derive the API origin from env so CSP connect-src is always correct.
const apiOrigin = (() => {
  try {
    const u = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api');
    return u.origin;
  } catch {
    return 'http://localhost:5000';
  }
})();

// ── Content-Security-Policy ───────────────────────────────────────────────────
// Rules:
//  • script-src: unsafe-inline needed for Next.js inline bootstrap scripts.
//    unsafe-eval is required for Razorpay's SDK and Stripe.js.
//  • frame-src: Stripe and Razorpay both render iframes for 3-D Secure / UPI.
//  • connect-src: payment provider APIs + our own backend.
//  • Never list frame-ancestors as 'self' — we lock it to 'none' to block clickjacking.
const CSP_DIRECTIVES = [
  "default-src 'self'",

  // Next.js inline scripts + payment SDKs (Razorpay uses eval internally) + Google Identity Services + Supademo
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.razorpay.com https://api.razorpay.com https://cdn.razorpay.com https://accounts.google.com https://script.supademo.com",

  // CSS — Tailwind inline styles; Google Fonts; Google Identity Services stylesheet
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",

  "font-src 'self' https://fonts.gstatic.com data:",

  "img-src 'self' blob: data: https: https://lh3.googleusercontent.com",

  // API, WebSockets, payment provider REST calls, Google auth
  [
    "connect-src 'self'",
    apiOrigin,
    `wss://${new URL(apiOrigin).host}`,
    'https://accounts.google.com',
    'https://api.stripe.com',
    'https://api.razorpay.com',
    'https://lumberjack.razorpay.com', // Razorpay analytics endpoint
    'https://app.supademo.com',
    'https://script.supademo.com',
  ].join(' '),

  // Stripe 3DS / Razorpay payment iframes + Google One Tap iframe + Supademo embed
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://api.razorpay.com https://checkout.razorpay.com https://accounts.google.com https://app.supademo.com",

  // Block all clickjacking — even from our own domain
  "frame-ancestors 'none'",

  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",

  // Upgrade any accidental http: sub-resources in production
  ...(process.env.NODE_ENV === 'production' ? ["upgrade-insecure-requests"] : []),
].join('; ');

// ── Security response headers ─────────────────────────────────────────────────
const SECURITY_HEADERS = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Block clickjacking via legacy header (CSP frame-ancestors is primary)
  { key: 'X-Frame-Options', value: 'DENY' },

  // Enable XSS auditor in older browsers
  { key: 'X-XSS-Protection', value: '1; mode=block' },

  // DNS prefetch for performance, privacy OK since assets are first-party
  { key: 'X-DNS-Prefetch-Control', value: 'on' },

  // Don't send Referer to cross-origin destinations
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // HSTS — production only; 1 year + includeSubDomains + preload
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }]
    : []),

  // Restrict access to browser APIs
  // payment=* required so Stripe/Razorpay iframes can invoke the Payment Request API
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), payment=*' },

  // Remove fingerprinting header
  { key: 'X-Powered-By', value: '' },

  // Cross-Origin Opener Policy — required for Google Sign-In (One Tap opens the Google auth popup)
  // COEP and CORP are intentionally omitted: both Razorpay and Stripe load payment iframes from
  // their own CDNs and do not set Cross-Origin-Resource-Policy: cross-origin on those responses,
  // so enabling COEP (even credentialless) causes the checkout iframe to load blank.
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },

  { key: 'Content-Security-Policy', value: CSP_DIRECTIVES },
];

// ── Webhook routes get permissive COEP so raw body parsing works ───────────────
// Webhook endpoints must read the raw body for signature verification.
// They never serve browser content so relaxed COEP is acceptable.
const WEBHOOK_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  async headers() {
    return [
      // Webhook routes — minimal headers, raw body access needed
      {
        source: '/api/webhooks/:path*',
        headers: WEBHOOK_HEADERS,
      },
      // All other routes — full security header set
      {
        source: '/((?!api/webhooks).*)',
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
