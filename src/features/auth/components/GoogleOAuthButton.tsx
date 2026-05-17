'use client';

import { useState } from 'react';
import { env } from '@/env';

const isConfigured = !!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleOAuthButton() {
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function handleGoogleLogin() {
    if (!isConfigured) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 4000);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({
      client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={handleGoogleLogin}
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
          cursor: isConfigured ? 'pointer' : 'not-allowed',
          opacity: loading ? 0.6 : isConfigured ? 1 : 0.45,
          transition: 'all 0.15s',
          fontFamily: 'inherit',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
        </svg>
        {loading ? 'Redirecting…' : 'Continue with Google'}
        {!isConfigured && (
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.08)', padding: '2px 7px', borderRadius: 6, marginLeft: 4, color: '#64748b' }}>
            Setup required
          </span>
        )}
      </button>

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
          Set <code style={{ color: '#a5b4fc', fontFamily: 'monospace', fontSize: 11 }}>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in your <code style={{ color: '#a5b4fc', fontFamily: 'monospace', fontSize: 11 }}>.env</code> to enable
          <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 10, height: 10, background: '#1e293b', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
        </div>
      )}
    </div>
  );
}
