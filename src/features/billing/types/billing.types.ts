import type { SubscriptionPlan, SubscriptionStatus } from '@/shared/types/auth.types';

// ── Payment provider ──────────────────────────────────────────────────────────
// Razorpay is used for Indian users (INR); Stripe for all international users.
export type PaymentProvider = 'stripe' | 'razorpay';

export interface RazorpayOrderResponse {
  /** Razorpay order id (order_XXXXXX) — pass to Razorpay.js open() */
  orderId: string;
  /** Amount in paise (INR smallest unit) */
  amount: number;
  currency: 'INR';
  keyId: string; // public Razorpay key — safe to expose
  subscriptionId: string; // our internal subscription record id
  notes: Record<string, string>;
}

export interface RazorpayPaymentSuccessPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export interface UsageRecord {
  feature: UsageFeature;
  used: number;
  limit: number;
  resetAt: string;
}

export type UsageFeature =
  | 'speaking_sessions'
  | 'writing_submissions'
  | 'ai_analysis'
  | 'mock_tests'
  | 'vocabulary_words';

export interface UsageSummary {
  records: UsageRecord[];
  billingPeriodStart: string;
  billingPeriodEnd: string;
}

export interface BillingPlan {
  id: SubscriptionPlan;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isPopular: boolean;
  stripePriceIdMonthly: string | null;
  stripePriceIdAnnual: string | null;
}

export type BillingInterval = 'monthly' | 'annual';

export interface CreateCheckoutRequest {
  plan: SubscriptionPlan;
  interval: BillingInterval;
  successUrl: string;
  cancelUrl: string;
  /** Client-detected provider hint. Backend MUST verify geo-IP; this is convenience only. */
  providerHint?: PaymentProvider;
}

export interface CreateCheckoutResponse {
  provider: PaymentProvider;
  sessionId: string;
  // Stripe
  checkoutUrl: string | null;
  // Razorpay (flat — matches backend CheckoutResult serialization)
  orderId: string | null;
  amountPaise: number | null;
  currency: string | null;
  keyId: string | null;
}

export interface CreatePortalResponse {
  portalUrl: string;
}

export interface BillingSessionStatus {
  sessionId: string;
  status: 'PENDING' | 'ACTIVE' | 'FAILED';
  plan: SubscriptionPlan | null;
  message: string | null;
}
