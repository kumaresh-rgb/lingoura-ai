'use client';

import { useAuthStore } from '../store/auth.store';
import type { User } from '@/shared/types/auth.types';

export function useCurrentUser(): User | null {
  return useAuthStore((s) => s.user);
}

export function useIsAuthenticated(): boolean {
  return useAuthStore((s) => s.isAuthenticated);
}

export function useIsInitializing(): boolean {
  return useAuthStore((s) => s.isInitializing);
}
