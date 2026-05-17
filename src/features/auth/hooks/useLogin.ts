'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';
import { mapAuthUser } from '@/shared/types/auth.types';
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';
import { ROUTES } from '@/shared/constants/routes';
import type { LoginInput } from '../schemas/auth.schemas';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const res = await authApi.login(credentials);
      setAuth(mapAuthUser(res.user), res.accessToken, res.refreshToken);
    },
    onSuccess: () => {
      const { hasCompletedOnboarding } = useOnboardingStore.getState();
      router.replace(hasCompletedOnboarding ? ROUTES.DASHBOARD : ROUTES.ONBOARDING);
    },
  });
}
