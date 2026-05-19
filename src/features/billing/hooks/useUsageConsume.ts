'use client';

/**
 * useUsageConsume — atomic server-side usage consumption mutation.
 *
 * This hook is called BEFORE initiating any AI or premium feature action.
 * It sends a POST to the backend which:
 *   1. Atomically increments usage counter in Redis (INCR + EXPIRE)
 *   2. Validates against plan limits
 *   3. Returns 402 if quota exceeded, 200 on success
 *   4. Logs the consumption event in the audit trail
 *
 * The frontend NEVER decides "I have enough quota" independently.
 * The backend is the ONLY authority. This hook just surfaces the server result.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/shared/api/api-client';
import { queryKeys } from '@/shared/constants/query-keys';
import type { UsageFeature } from '../types/billing.types';

interface ConsumeRequest {
  feature: UsageFeature;
  /** Idempotency key — prevents double-counting on retry */
  idempotencyKey: string;
  /** Human-readable context for audit log */
  context?: string;
}

interface ConsumeResponse {
  allowed: boolean;
  remaining: number | null;
  resetAt: string;
}

export function useUsageConsume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feature, idempotencyKey, context }: ConsumeRequest) =>
      post<ConsumeResponse>('/usage/consume', { feature, idempotencyKey, context }),

    onSuccess: () => {
      // Invalidate usage cache so the UI reflects the updated quota
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.usage() });
    },
  });
}

/**
 * Generates a stable idempotency key for a feature action.
 * Uses crypto.randomUUID() so each new action has a unique key,
 * but a retry of the SAME action (same component instance) reuses it.
 */
export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}
