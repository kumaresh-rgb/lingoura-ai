'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authApi } from '@/features/auth/api/auth.api';
import { storageService } from '@/shared/services/storage.service';
import { STORAGE_KEYS } from '@/shared/constants/app.constants';
import { mapAuthUser } from '@/shared/types/auth.types';
import { useRazorpayCheckout } from '@/features/billing/hooks/useRazorpayCheckout';
import { useSubscriptionStore } from '@/features/billing/store/subscription.store';
import { ROUTES } from '@/shared/constants/routes';

function RazorpayCheckoutHandler() {
  const router = useRouter();
  const setPlan = useSubscriptionStore((s) => s.setPlan);

  useRazorpayCheckout({
    onSuccess: () => {
      // Optimistically mark the user as PRO immediately so every component
      // that reads useSubscriptionStore reflects the upgrade without waiting
      // for a network round-trip. The background re-fetch (triggered by
      // invalidateQueries in useRazorpayCheckout) will confirm the real value.
      setPlan('PRO', 'ACTIVE', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());

      // Navigate to dashboard so the user sees their upgraded experience
      router.push(ROUTES.DASHBOARD);
    },
  });

  return null;
}

function AuthInitializer() {
  const { setAuth, logout, setInitializing } = useAuthStore();

  useEffect(() => {
    async function restoreSession() {
      const storedRefreshToken = storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);

      if (!storedRefreshToken) {
        logout();
        setInitializing(false);
        return;
      }

      try {
        const response = await authApi.refresh(storedRefreshToken);
        setAuth(mapAuthUser(response.user), response.accessToken, response.refreshToken);
      } catch {
        storageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
        logout();
      } finally {
        setInitializing(false);
      }
    }

    restoreSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          <AuthInitializer />
          <RazorpayCheckoutHandler />
          {children}
        </QueryProvider>
      </ThemeProvider>
    </>
  );
}
