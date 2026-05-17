'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { billingApi } from '../api/billing.api';
import { useSubscriptionStore } from '../store/subscription.store';
import { useEffect } from 'react';

export function useSubscription() {
  const setPlan = useSubscriptionStore((s) => s.setPlan);

  const query = useQuery({
    queryKey: queryKeys.billing.subscription(),
    queryFn: billingApi.getSubscription,
    staleTime: 5 * 60 * 1000, // 5 min — subscription changes infrequently
    retry: 2,
  });

  useEffect(() => {
    if (query.data) {
      setPlan(query.data.plan, query.data.status, query.data.currentPeriodEnd);
    }
  }, [query.data, setPlan]);

  return query;
}

export function useUsage() {
  const setUsage = useSubscriptionStore((s) => s.setUsage);

  const query = useQuery({
    queryKey: queryKeys.billing.usage(),
    queryFn: billingApi.getUsage,
    staleTime: 60 * 1000, // 1 min — usage updates frequently
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (query.data) {
      setUsage(query.data);
    }
  }, [query.data, setUsage]);

  return query;
}

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.billing.plans(),
    queryFn: billingApi.getPlans,
    staleTime: 30 * 60 * 1000, // 30 min — plans rarely change
    gcTime: 60 * 60 * 1000,
  });
}
