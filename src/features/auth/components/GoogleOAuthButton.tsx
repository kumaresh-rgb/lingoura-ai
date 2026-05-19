'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { env } from '@/env';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { mapAuthUser } from '@/shared/types/auth.types';
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';
import { ROUTES } from '@/shared/constants/routes';

// ── Google Identity Services type shim ────────────────────────────────────────
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (res: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (
            momentListener?: (n: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
              isDismissedMoment: () => boolean;
            }) => void
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const isConfigured = !!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Module-level: survives component unmount/remount (e.g. login → register → login navigation)
let _gsiInitialized = false;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

export function GoogleOAuthButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  // Keep a stable ref to the latest callback so initialize() is only called once
  // but still uses the most-recent auth/router references.
  const callbackRef = useCallback(
    async (response: { credential: string }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await authApi.googleLogin(response.credential);
        setAuth(mapAuthUser(result.user), result.accessToken, result.refreshToken);
        const { hasCompletedOnboarding } = useOnboardingStore.getState();
        router.replace(hasCompletedOnboarding ? ROUTES.DASHBOARD : ROUTES.ONBOARDING);
      } catch {
        setError('Google sign-in failed. Please try again.');
        setLoading(false);
      }
    },
    [setAuth, router],
  );
  const latestCallback = useRef(callbackRef);
  useEffect(() => { latestCallback.current = callbackRef; }, [callbackRef]);

  useEffect(() => {
    if (!isConfigured) return;

    function tryInit(): boolean {
      if (!window.google?.accounts?.id) return false;
      if (!_gsiInitialized) {
        _gsiInitialized = true;
        window.google.accounts.id.initialize({
          client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          // Indirect via ref so we only call initialize() once but still get fresh closures
          callback: (res) => latestCallback.current(res),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
      // Always mark ready — covers remount where GSI is already initialized
      setScriptReady(true);
      return true;
    }

    if (!tryInit()) {
      const timer = setInterval(() => {
        if (tryInit()) clearInterval(timer);
      }, 150);
      return () => clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — initialize exactly once per mount

  function handleClick() {
    if (!isConfigured) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 4000);
      return;
    }

    if (!scriptReady || !window.google?.accounts?.id) {
      setError('Google sign-in is still loading — please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setLoading(false);
        setError(
          'Google sign-in could not be shown. Allow pop-ups for this site and try again.',
        );
      }
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '13px 16px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          color: '#cbd5e1',
          fontWeight: 600,
          fontSize: 14,
          cursor: loading || !isConfigured ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : isConfigured ? 1 : 0.45,
          transition: 'all 0.15s',
          fontFamily: 'inherit',
        }}
      >
        <GoogleIcon />
        {loading ? 'Signing in…' : 'Continue with Google'}
        {!isConfigured && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.08)',
              padding: '2px 7px',
              borderRadius: 6,
              marginLeft: 4,
              color: '#64748b',
            }}
          >
            Setup required
          </span>
        )}
      </button>

      {error && (
        <p
          style={{
            textAlign: 'center',
            color: '#f87171',
            fontSize: 12,
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          {error}
        </p>
      )}

      {showHint && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 12,
            fontWeight: 500,
            color: '#94a3b8',
            whiteSpace: 'nowrap',
            zIndex: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          Set{' '}
          <code style={{ color: '#a5b4fc', fontFamily: 'monospace', fontSize: 11 }}>
            NEXT_PUBLIC_GOOGLE_CLIENT_ID
          </code>{' '}
          in your{' '}
          <code style={{ color: '#a5b4fc', fontFamily: 'monospace', fontSize: 11 }}>
            .env.local
          </code>{' '}
          to enable
          <div
            style={{
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 10,
              height: 10,
              background: '#1e293b',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      )}
    </div>
  );
}
