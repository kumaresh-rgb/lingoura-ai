'use client';

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authApi } from '@/features/auth/api/auth.api';
import { storageService } from '@/shared/services/storage.service';
import { STORAGE_KEYS } from '@/shared/constants/app.constants';
import { mapAuthUser } from '@/shared/types/auth.types';

function AuthInitializer() {
  const { setAuth, logout, setInitializing } = useAuthStore();

  useEffect(() => {
    async function restoreSession() {
      const storedRefreshToken = storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);

      // No stored session — skip the network call entirely
      if (!storedRefreshToken) {
        logout();
        setInitializing(false);
        return;
      }

      try {
        const response = await authApi.refresh(storedRefreshToken);
        // Token rotation: backend issues a new refresh token each time
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
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthInitializer />
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}
