import { NextRequest, NextResponse } from 'next/server';
import type { AuthResponse } from '@/shared/types/auth.types';
import type { ApiResponse } from '@/shared/types/api.types';

const API_BASE    = process.env.NEXT_PUBLIC_API_URL   ?? 'http://localhost:5000/api';
const APP_URL     = process.env.NEXT_PUBLIC_APP_URL   ?? 'http://localhost:3000';
const CLIENT_ID   = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? '';
const REDIRECT_URI = `${APP_URL}/api/auth/callback`;

const cookieOpts = {
  httpOnly: false,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60, // consumed immediately by /google/success
} as const;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code       = searchParams.get('code');
  const errorParam = searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorParam)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    // ── Step 1: Exchange authorization code for Google tokens ────────────────
    const googleRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri:  REDIRECT_URI,
        grant_type:    'authorization_code',
      }).toString(),
    });

    if (!googleRes.ok) {
      const err = await googleRes.json().catch(() => ({}));
      console.error('[OAuth] Google token exchange failed:', googleRes.status, err);
      return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
    }

    const googleTokens = await googleRes.json() as { id_token?: string };

    if (!googleTokens.id_token) {
      console.error('[OAuth] No id_token in Google response');
      return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
    }

    // ── Step 2: Validate id_token via backend ────────────────────────────────
    const backendRes = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: googleTokens.id_token }),
    });

    if (!backendRes.ok) {
      const text = await backendRes.text().catch(() => '');
      console.error('[OAuth] Backend auth/google failed:', backendRes.status, text);
      return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
    }

    const json = await backendRes.json();
    // Handle both { data: AuthResponse } envelope and flat AuthResponse
    const authData: AuthResponse = (json as ApiResponse<AuthResponse>).data ?? json;
    const { accessToken, refreshToken, user } = authData;

    // ── Step 3: Hand off to client via short-lived cookies ───────────────────
    const res = NextResponse.redirect(new URL('/google/success', request.url));
    res.cookies.set('lingoura_oauth_token',   accessToken,           cookieOpts);
    res.cookies.set('lingoura_oauth_refresh',  refreshToken,          cookieOpts);
    res.cookies.set('lingoura_oauth_user',     JSON.stringify(user),  cookieOpts);

    return res;
  } catch (err) {
    console.error('[OAuth] Unexpected error:', err);
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
  }
}
