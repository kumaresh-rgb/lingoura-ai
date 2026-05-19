import { get, post, del } from '@/shared/api/api-client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type {
  Subscription,
  UsageRecord,
  BillingPlan,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  CreatePortalResponse,
  BillingSessionStatus,
} from '../types/billing.types';

export const billingApi = {
  getSubscription: (): Promise<Subscription> =>
    get<Subscription>(API_ENDPOINTS.billing.subscription),

  getUsage: (): Promise<UsageRecord[]> =>
    get<UsageRecord[]>(API_ENDPOINTS.billing.usage),

  getPlans: (): Promise<BillingPlan[]> =>
    get<BillingPlan[]>(API_ENDPOINTS.billing.plans),

  createCheckout: (data: CreateCheckoutRequest): Promise<CreateCheckoutResponse> =>
    post<CreateCheckoutResponse>(API_ENDPOINTS.billing.createCheckout, data),

  createPortal: (): Promise<CreatePortalResponse> =>
    post<CreatePortalResponse>(API_ENDPOINTS.billing.createPortal),

  getSession: (sessionId: string): Promise<BillingSessionStatus> =>
    get<BillingSessionStatus>(API_ENDPOINTS.billing.session(sessionId)),

  cancelSubscription: (reason: string): Promise<void> =>
    del<void>(`${API_ENDPOINTS.billing.cancelSubscription}?reason=${encodeURIComponent(reason)}`),

  reactivateSubscription: (): Promise<Subscription> =>
    post<Subscription>(API_ENDPOINTS.billing.reactivateSubscription),
};
