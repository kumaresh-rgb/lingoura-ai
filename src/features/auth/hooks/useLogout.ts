'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';
import { storageService } from '@/shared/services/storage.service';
import { STORAGE_KEYS } from '@/shared/constants/app.constants';
import { ROUTES } from '@/shared/constants/routes';

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => {
      const refreshToken = storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN) ?? '';
      return authApi.logout(refreshToken);
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      router.replace(ROUTES.LOGIN);
    },
  });
}
