'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { mapAuthUser, type AuthUser } from '@/shared/types/auth.types';
import { ROUTES } from '@/shared/constants/routes';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export default function GoogleSuccessPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const accessToken  = getCookie('lingoura_oauth_token');
    const refreshToken = getCookie('lingoura_oauth_refresh');
    const userRaw      = getCookie('lingoura_oauth_user');

    deleteCookie('lingoura_oauth_token');
    deleteCookie('lingoura_oauth_refresh');
    deleteCookie('lingoura_oauth_user');

    if (!accessToken || !refreshToken || !userRaw) {
      router.replace('/login?error=oauth_failed');
      return;
    }

    try {
      const authUser: AuthUser = JSON.parse(userRaw);
      setAuth(mapAuthUser(authUser), accessToken, refreshToken);
      router.replace(ROUTES.DASHBOARD);
    } catch {
      router.replace('/login?error=oauth_failed');
    }
  }, [router, setAuth]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '3px solid rgba(99,102,241,0.2)',
        borderTopColor: '#6366f1',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Signing you in…</p>
    </div>
  );
}
