'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { billingApi } from '../api/billing.api';
import { queryKeys } from '@/shared/constants/query-keys';
import { useSubscriptionStore } from '../store/subscription.store';

const MAX_POLL_ATTEMPTS = 20; // 20 × 3s = 60s max
const POLL_INTERVAL_MS = 3000;

export function useBillingSuccess(sessionId: string | null) {
  const [attempts, setAttempts] = useState(0);
  const queryClient = useQueryClient();
  const setPlan = useSubscriptionStore((s) => s.setPlan);

  const query = useQuery({
    queryKey: queryKeys.billing.session(sessionId ?? ''),
    queryFn: () => billingApi.getSession(sessionId!),
    enabled: !!sessionId && attempts < MAX_POLL_ATTEMPTS,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'ACTIVE' || status === 'FAILED') return false;
      return POLL_INTERVAL_MS;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (query.data) {
      setAttempts((n) => n + 1);

      if (query.data.status === 'ACTIVE' && query.data.plan) {
        setPlan(query.data.plan, 'ACTIVE', null);
        // Invalidate subscription so it re-fetches the full record
        queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
      }
    }
  }, [query.data, setPlan, queryClient]);

  const isTimedOut = attempts >= MAX_POLL_ATTEMPTS && query.data?.status === 'PENDING';

  return {
    status: query.data?.status ?? 'PENDING',
    plan: query.data?.plan ?? null,
    isLoading: query.isLoading || query.data?.status === 'PENDING',
    isActive: query.data?.status === 'ACTIVE',
    isFailed: query.data?.status === 'FAILED' || isTimedOut,
    isTimedOut,
  };
}
