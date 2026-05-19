'use client';

import { useMutation } from '@tanstack/react-query';
import { billingApi } from '../api/billing.api';
import type { BillingInterval } from '../types/billing.types';
import type { SubscriptionPlan } from '@/shared/types/auth.types';
import { ROUTES } from '@/shared/constants/routes';
import { env } from '@/env';

export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({ plan, interval, providerHint }: { plan: SubscriptionPlan; interval: BillingInterval; providerHint?: import('../types/billing.types').PaymentProvider }) =>
      billingApi.createCheckout({
        plan,
        interval,
        successUrl: `${env.NEXT_PUBLIC_APP_URL}${ROUTES.BILLING_SUCCESS}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${env.NEXT_PUBLIC_APP_URL}${ROUTES.BILLING_CANCEL}`,
        providerHint,
      }),
    onSuccess: (data, variables) => {
      if (data.provider === 'stripe' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.provider === 'razorpay' && data.orderId) {
        window.dispatchEvent(
          new CustomEvent('lingoura:razorpay-checkout', {
            detail: {
              orderId: data.orderId,
              amount: data.amountPaise,          // already in paise — Razorpay expects paise
              currency: (data.currency ?? 'INR') as 'INR',
              keyId: data.keyId ?? env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              subscriptionId: data.sessionId,
              notes: {},
              plan: variables.plan,              // pass plan so providers.tsx can do optimistic update
            },
          })
        );
      }
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
