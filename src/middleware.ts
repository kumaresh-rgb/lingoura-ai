import { type NextRequest, NextResponse } from 'next/server';

// ── Route classification ──────────────────────────────────────────────────────

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/speaking',
  '/listening',
  '/writing',
  '/reading',
  '/vocabulary',
  '/lessons',
  '/analytics',
  '/progress',
  '/review',
  '/settings',
  '/billing',
  '/onboarding',
];

const AUTH_PREFIXES = ['/login', '/register', '/forgot-password'];

// Webhook routes bypass all guards — they have their own HMAC verification
const WEBHOOK_PREFIX = '/api/webhooks';

// ── CSRF token constants ──────────────────────────────────────────────────────
const CSRF_COOKIE = 'lingoura_csrf';
const CSRF_HEADER = 'x-csrf-token';

// State-mutating methods that require CSRF verification
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// API sub-paths that are exempt from CSRF (webhooks use HMAC, OAuth uses redirect)
const CSRF_EXEMPT_PATTERNS = [
  /^\/api\/webhooks\//,
  /^\/api\/auth\/callback/,
];

function isCsrfExempt(pathname: string): boolean {
  return CSRF_EXEMPT_PATTERNS.some((re) => re.test(pathname));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isWebhookRoute(pathname: string): boolean {
  return pathname.startsWith(WEBHOOK_PREFIX);
}

// ── Middleware ────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // ── 1. Webhook routes — pass through immediately; HMAC handles auth ──────
  if (isWebhookRoute(pathname)) {
    return NextResponse.next();
  }

  // ── 2. Auth signal — presence of session cookie (value validated by API) ─
  const hasSession = request.cookies.has('lingoura_session');

  // ── 3. Route guards (UX redirect only — backend is the real enforcer) ────
  if (isProtectedRoute(pathname) && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute(pathname) && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ── 4. CSRF double-submit cookie pattern ──────────────────────────────────
  //
  //  How it works:
  //   • On every response we set a CSRF token in a readable (non-HttpOnly) cookie.
  //   • JavaScript reads it and echoes it back in the X-CSRF-Token request header.
  //   • Middleware verifies header === cookie on unsafe methods.
  //   • An attacker's page cannot read our cookies (SameSite=Strict) and therefore
  //     cannot construct the header, making CSRF impossible.
  //
  //  Note: This layer supplements the backend's own anti-forgery validation,
  //  it does NOT replace it.  The backend must also validate on every mutation.
  //
  const existingCsrf = request.cookies.get(CSRF_COOKIE)?.value;

  // Verify CSRF on state-mutating API calls (not webhooks, not OAuth)
  if (
    method && UNSAFE_METHODS.has(method) &&
    pathname.startsWith('/api/') &&
    !isCsrfExempt(pathname)
  ) {
    const headerToken = request.headers.get(CSRF_HEADER);
    if (!existingCsrf || !headerToken || existingCsrf !== headerToken) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF token mismatch', code: 'CSRF_INVALID' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // ── 5. Build response + attach / refresh CSRF cookie ─────────────────────
  const response = NextResponse.next();

  // Generate a new token or carry the existing one forward
  const csrfToken = existingCsrf ?? crypto.randomUUID();

  // SameSite=Strict: readable by JS (no HttpOnly) so the client can echo it
  // Secure in production; Path=/ so all routes can read it
  response.cookies.set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,          // must be readable by JS to set the request header
    sameSite: 'strict',       // prevents cross-site submission entirely
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,     // 24 h — refreshed on every response
  });

  // ── 6. Correlation ID for distributed tracing ─────────────────────────────
  const correlationId = request.headers.get('x-correlation-id') ?? crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  response.headers.set('x-correlation-id', correlationId);

  // ── 7. Cache-control for authenticated pages ──────────────────────────────
  if (isProtectedRoute(pathname)) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }

  return response;
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.webp).*)',
  ],
};
