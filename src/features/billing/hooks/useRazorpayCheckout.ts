'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { openRazorpayCheckout } from '../utils/payment-region';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { env } from '@/env';
import { queryKeys } from '@/shared/constants/query-keys';
import type { RazorpayOrderResponse } from '../types/billing.types';

interface UseRazorpayCheckoutOptions {
  onSuccess?: (payload: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  onDismiss?: () => void;
}

/**
 * Listens for the `lingoura:razorpay-checkout` custom event dispatched by
 * useCreateCheckout and opens the Razorpay modal.
 *
 * Mount this once near the root of the app (e.g. in Providers or DashboardLayout)
 * so any checkout trigger anywhere in the tree is handled.
 */
export function useRazorpayCheckout({ onSuccess, onDismiss }: UseRazorpayCheckoutOptions = {}) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const handleCheckoutEvent = useCallback(
    (event: CustomEvent<RazorpayOrderResponse>) => {
      const order = event.detail;
      const keyId = order.keyId || env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      openRazorpayCheckout({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId,
        userName: user?.displayName ?? '',
        userEmail: user?.email ?? '',
        description: 'Lingoura AI Subscription',
        onSuccess: (payload) => {
          console.debug('[Billing] Razorpay payment success', payload.razorpay_payment_id);
          // Explicitly refresh billing data after successful payment.
          // refetchOnWindowFocus is disabled so we must invalidate manually here.
          void queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
          void queryClient.invalidateQueries({ queryKey: queryKeys.billing.usage() });
          onSuccess?.(payload);
        },
        onDismiss: () => {
          console.debug('[Billing] Razorpay modal closed — no charge made');
          // No refetch on dismiss — avoids the API loop when the modal closes and
          // the window regains focus.
          onDismiss?.();
        },
      });
    },
    [user, queryClient, onSuccess, onDismiss]
  );

  useEffect(() => {
    const handler = (e: Event) => handleCheckoutEvent(e as CustomEvent<RazorpayOrderResponse>);
    window.addEventListener('lingoura:razorpay-checkout', handler);
    return () => window.removeEventListener('lingoura:razorpay-checkout', handler);
  }, [handleCheckoutEvent]);
}
