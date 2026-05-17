import type { NextConfig } from 'next';

// Extract the origin (scheme + host + port) from the API URL so CSP connect-src
// uses the full origin, not a path — CSP path matching requires a trailing slash
// for prefix semantics, and bare paths without trailing slash are exact-match only.
const apiOrigin = (() => {
  try {
    const u = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api');
    return u.origin; // "http://localhost:5000"
  } catch {
    return 'http://localhost:5000';
  }
})();

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' blob: data: https:",
      // Allow all paths on the API origin + WebSocket on same host
      `connect-src 'self' ${apiOrigin} wss://${new URL(apiOrigin).host} https://accounts.google.com`,
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  // Require explicit image domains for next/image security
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
