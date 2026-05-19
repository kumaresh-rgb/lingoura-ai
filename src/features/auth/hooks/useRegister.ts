'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';
import { mapAuthUser } from '@/shared/types/auth.types';
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';
import { ROUTES } from '@/shared/constants/routes';
import type { RegisterInput } from '../schemas/auth.schemas';

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await authApi.register(data);
      setAuth(mapAuthUser(res.user), res.accessToken, res.refreshToken);
    },
    onSuccess: () => {
      // New registrations always start onboarding — reset any stale localStorage state
      useOnboardingStore.getState().resetOnboarding();
      router.replace(ROUTES.ONBOARDING);
    },
  });
}
