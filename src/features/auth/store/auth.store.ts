import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@/shared/types/auth.types';
import { storageService } from '@/shared/services/storage.service';
import { STORAGE_KEYS, COOKIE_KEYS } from '@/shared/constants/app.constants';

const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days — matches refresh token expiry

function setSessionCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_KEYS.SESSION}=1; path=/; max-age=${SESSION_MAX_AGE}; samesite=lax`;
  }
}

function clearSessionCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_KEYS.SESSION}=; path=/; max-age=0; samesite=lax`;
  }
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setInitializing: (value: boolean) => void;
}

function syncSubscriptionStore(user: User | null) {
  import('@/features/billing/store/subscription.store').then(({ useSubscriptionStore }) => {
    const store = useSubscriptionStore.getState();
    if (user?.subscription) {
      store.setPlan(user.subscription.plan, user.subscription.status, user.subscription.periodEnd);
    } else {
      store.reset();
    }
  });
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitializing: true,

      setAuth: (user, accessToken, refreshToken) => {
        storageService.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        storageService.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        setSessionCookie();
        syncSubscriptionStore(user);
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      logout: () => {
        storageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
        clearSessionCookie();
        syncSubscriptionStore(null);
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      setInitializing: (isInitializing) => set({ isInitializing }),
    }),
    { name: 'auth-store' }
  )
);
