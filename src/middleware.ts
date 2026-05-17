import { type NextRequest, NextResponse } from 'next/server';

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

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Presence of the session cookie acts as the auth signal in middleware.
  // Full token validation happens server-side on the API.
  const hasSession = request.cookies.has('lingoura_session');

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Unauthenticated access to protected route → send to login
  if (isProtected && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user hitting auth route → send to dashboard
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip static files, images, and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|public|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)'],
};
