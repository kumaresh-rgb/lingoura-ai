'use client';

import { useMutation } from '@tanstack/react-query';
import { billingApi } from '../api/billing.api';
import type { BillingInterval } from '../types/billing.types';
import type { SubscriptionPlan } from '@/shared/types/auth.types';
import { ROUTES } from '@/shared/constants/routes';
import { env } from '@/env';

export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({ plan, interval }: { plan: SubscriptionPlan; interval: BillingInterval }) =>
      billingApi.createCheckout({
        plan,
        interval,
        successUrl: `${env.NEXT_PUBLIC_APP_URL}${ROUTES.BILLING_SUCCESS}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${env.NEXT_PUBLIC_APP_URL}${ROUTES.BILLING_CANCEL}`,
      }),
    onSuccess: ({ checkoutUrl }) => {
      window.location.href = checkoutUrl;
    },
  });
}

export function useCreatePortal() {
  return useMutation({
    mutationFn: billingApi.createPortal,
    onSuccess: ({ portalUrl }) => {
      window.location.href = portalUrl;
    },
  });
}
