# Lingoura AI — SaaS Authentication, Pricing & Subscription Architecture

**Version:** 1.0  
**Classification:** Authoritative Engineering Reference  
**Date:** 2026-05-16  
**Scope:** Authentication · Billing · Subscriptions · Feature Gating · Usage Limits · Security

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Model Architecture](#2-business-model-architecture)
3. [Database Schema Design](#3-database-schema-design)
4. [Authentication Architecture](#4-authentication-architecture)
5. [Subscription Lifecycle Architecture](#5-subscription-lifecycle-architecture)
6. [Stripe Integration Architecture](#6-stripe-integration-architecture)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Backend Architecture](#8-backend-architecture)
9. [Middleware & Route Protection Strategy](#9-middleware--route-protection-strategy)
10. [Feature Gating Architecture](#10-feature-gating-architecture)
11. [Usage Limit Architecture](#11-usage-limit-architecture)
12. [Webhook Architecture](#12-webhook-architecture)
13. [React Query Strategy](#13-react-query-strategy)
14. [Zustand State Model](#14-zustand-state-model)
15. [Edge Case Handling](#15-edge-case-handling)
16. [Security Architecture](#16-security-architecture)
17. [API Contract Reference](#17-api-contract-reference)
18. [Sequence Diagrams](#18-sequence-diagrams)
19. [Observability & Analytics](#19-observability--analytics)
20. [Production Deployment & Scalability](#20-production-deployment--scalability)

---

## 1. Executive Summary

### The Core Mental Model

Lingoura AI separates three independent concerns that are often incorrectly coupled in SaaS products:

```
LAYER 1 — Authentication
  "Who are you?"
  JWT access tokens + refresh token rotation
  Result: User identity

LAYER 2 — Subscription State
  "What plan are you on?"
  Stripe-managed, webhook-confirmed
  Result: Plan (FREE | PRO | ENTERPRISE)

LAYER 3 — Feature Authorization
  "Can you use this feature?"
  Backend policy enforcement per endpoint
  Result: 200 OK or 403 Forbidden

LAYER 4 — Usage Limits
  "How much have you used today?"
  Server-side rate tracking with daily resets
  Result: 200 OK or 429 Too Many Requests
```

**These layers are independent.** A user can be authenticated (Layer 1) without a paid subscription (Layer 2). A PRO user can be blocked from a feature if over a burst rate limit (Layer 4). The frontend reflects these states — it never enforces them.

### Non-Negotiable Principles

1. **Frontend is UX, backend is security.** Every premium route check in the browser is a convenience, not a gate.
2. **Webhooks are source of truth for billing.** A Stripe redirect success page means nothing without webhook confirmation.
3. **Subscription and authentication are decoupled.** Dashboard access is tied to authentication. Feature access is tied to subscription.
4. **Access tokens live in memory only.** Never `localStorage`. Never `sessionStorage`. Zustand only.
5. **Refresh tokens are httpOnly cookies.** Completely opaque to JavaScript.

---

## 2. Business Model Architecture

### Subscription Tiers

```typescript
// Extensible plan enum — never hardcode plan logic
export enum SubscriptionPlan {
  FREE       = 'FREE',
  PRO        = 'PRO',
  TEAM       = 'TEAM',        // future
  ENTERPRISE = 'ENTERPRISE',  // future
  EDUCATOR   = 'EDUCATOR',    // future
}

export enum SubscriptionStatus {
  FREE      = 'FREE',      // never subscribed
  TRIAL     = 'TRIAL',     // trialing
  ACTIVE    = 'ACTIVE',    // paid and active
  PAST_DUE  = 'PAST_DUE',  // payment failed, grace period
  CANCELED  = 'CANCELED',  // canceled, still in period
  EXPIRED   = 'EXPIRED',   // period ended
}
```

### Plan Capability Matrix

| Feature | FREE | PRO | ENTERPRISE |
|---|---|---|---|
| Dashboard access | ✓ | ✓ | ✓ |
| Speaking sessions | 3/day | Unlimited | Unlimited |
| AI corrections | 5/day | Unlimited | Unlimited |
| Vocabulary generation | 10/day | Unlimited | Unlimited |
| Basic analytics | ✓ | ✓ | ✓ |
| Advanced CEFR analysis | — | ✓ | ✓ |
| AI writing review | — | ✓ | ✓ |
| Export reports | — | ✓ | ✓ |
| Advanced analytics | — | ✓ | ✓ |
| Priority AI response | — | ✓ | ✓ |
| Team management | — | — | ✓ |
| SSO | — | — | ✓ |
| Custom word lists | — | — | ✓ |

### Access Decision Flow

```
REQUEST ARRIVES
     │
     ▼
┌─────────────────────┐
│  Is JWT valid?      │──No──→ 401 Unauthorized
└─────────────────────┘
     │ Yes
     ▼
┌─────────────────────┐
│  Is subscription    │
│  status valid?      │──No──→ 402 Payment Required
│  (ACTIVE/FREE/TRIAL)│        (with upgrade URL)
└─────────────────────┘
     │ Yes
     ▼
┌─────────────────────┐
│  Does plan grant    │
│  access to this     │──No──→ 403 Forbidden
│  feature/endpoint?  │        (plan insufficient)
└─────────────────────┘
     │ Yes
     ▼
┌─────────────────────┐
│  Is usage within    │
│  limits for today?  │──No──→ 429 Too Many Requests
└─────────────────────┘
     │ Yes
     ▼
   200 OK + Resource
```

---

## 3. Database Schema Design

### PostgreSQL Schema — Complete Entity Definitions

```sql
-- ─────────────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN', 'SUPPORT');
CREATE TYPE subscription_plan AS ENUM ('FREE', 'PRO', 'TEAM', 'ENTERPRISE', 'EDUCATOR');
CREATE TYPE subscription_status AS ENUM ('FREE', 'TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');
CREATE TYPE billing_provider AS ENUM ('STRIPE', 'MANUAL');
CREATE TYPE feature_key AS ENUM (
  'SPEAKING_SESSION',
  'AI_CORRECTION',
  'VOCABULARY_GENERATION',
  'AI_WRITING_REVIEW',
  'ADVANCED_ANALYTICS',
  'EXPORT_REPORT',
  'CEFR_DEEP_ANALYSIS'
);
CREATE TYPE webhook_event_status AS ENUM ('PENDING', 'PROCESSED', 'FAILED', 'IGNORED');

-- ─────────────────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255) NOT NULL UNIQUE,
  display_name      VARCHAR(100) NOT NULL,
  password_hash     VARCHAR(255),                    -- NULL for OAuth-only users
  google_id         VARCHAR(255) UNIQUE,
  avatar_url        TEXT,
  role              user_role NOT NULL DEFAULT 'STUDENT',
  email_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,
  cefr_level        VARCHAR(2) DEFAULT 'B1',
  target_band       DECIMAL(2,1) DEFAULT 7.0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at     TIMESTAMPTZ,
  deleted_at        TIMESTAMPTZ                      -- soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────────────────────────
-- REFRESH TOKENS
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE refresh_tokens (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash   VARCHAR(255) NOT NULL UNIQUE,         -- bcrypt hash, never store raw
  device_info  VARCHAR(255),
  ip_address   INET,
  expires_at   TIMESTAMPTZ NOT NULL,
  revoked_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- ─────────────────────────────────────────────────────────────────────────
-- SUBSCRIPTIONS
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE subscriptions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider                  billing_provider NOT NULL DEFAULT 'STRIPE',
  provider_customer_id      VARCHAR(255),            -- Stripe customer ID
  provider_subscription_id  VARCHAR(255) UNIQUE,     -- Stripe subscription ID
  provider_price_id         VARCHAR(255),            -- Stripe price ID
  plan                      subscription_plan NOT NULL DEFAULT 'FREE',
  status                    subscription_status NOT NULL DEFAULT 'FREE',
  current_period_start      TIMESTAMPTZ,
  current_period_end        TIMESTAMPTZ,
  cancel_at_period_end      BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at               TIMESTAMPTZ,
  trial_start               TIMESTAMPTZ,
  trial_end                 TIMESTAMPTZ,
  metadata                  JSONB DEFAULT '{}',
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_subscriptions_user_id ON subscriptions(user_id);  -- one active sub per user
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(provider_customer_id);
CREATE INDEX idx_subscriptions_stripe_sub ON subscriptions(provider_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- ─────────────────────────────────────────────────────────────────────────
-- USAGE TRACKING
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE usage_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature       feature_key NOT NULL,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,   -- daily bucket
  daily_count   INTEGER NOT NULL DEFAULT 0,
  monthly_count INTEGER NOT NULL DEFAULT 0,
  last_used_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reset_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_usage_user_feature_date ON usage_records(user_id, feature, date);
CREATE INDEX idx_usage_user_id ON usage_records(user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- STRIPE WEBHOOK EVENTS (idempotency log)
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE webhook_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider         billing_provider NOT NULL DEFAULT 'STRIPE',
  event_id         VARCHAR(255) NOT NULL UNIQUE,     -- Stripe event ID
  event_type       VARCHAR(100) NOT NULL,
  status           webhook_event_status NOT NULL DEFAULT 'PENDING',
  payload          JSONB NOT NULL,
  error_message    TEXT,
  processed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX idx_webhook_events_status ON webhook_events(status);
CREATE INDEX idx_webhook_events_type ON webhook_events(event_type);

-- ─────────────────────────────────────────────────────────────────────────
-- BILLING AUDIT LOG
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE billing_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type  VARCHAR(100) NOT NULL,
  plan_before subscription_plan,
  plan_after  subscription_plan,
  amount      INTEGER,                               -- in cents
  currency    VARCHAR(3) DEFAULT 'USD',
  stripe_ref  VARCHAR(255),
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_billing_audit_user ON billing_audit_log(user_id);
CREATE INDEX idx_billing_audit_created ON billing_audit_log(created_at);
```

### Entity Relationships

```
users (1) ──────────── (1) subscriptions
  │                         │
  │                         └── Stripe Customer → Stripe Subscription
  │
  ├──── (many) refresh_tokens
  ├──── (many) usage_records  [user_id + feature + date → unique]
  └──── (many) billing_audit_log
```

---

## 4. Authentication Architecture

### Token Design

```
ACCESS TOKEN (JWT)
├── Header: { alg: RS256, typ: JWT }
├── Payload:
│   ├── sub: user UUID
│   ├── email: string
│   ├── role: UserRole
│   ├── plan: SubscriptionPlan        ← embedded for fast auth checks
│   ├── status: SubscriptionStatus
│   ├── iat: issued at
│   ├── exp: expires at (15 minutes)
│   └── jti: JWT ID (for revocation)
└── Signature: RS256 with private key

REFRESH TOKEN
├── Format: cryptographically random 64-byte token (base64url)
├── Storage: bcrypt hash in database
├── Transport: httpOnly, Secure, SameSite=Strict cookie
├── Lifetime: 30 days (rotating)
└── Rotation: every refresh invalidates old token, issues new
```

### Auth Flow — Login

```
Client                         Backend                        Database
  │                               │                               │
  │─── POST /auth/login ──────────▶                               │
  │    { email, password }        │                               │
  │                               │──── SELECT user WHERE ───────▶│
  │                               │     email = $1                │
  │                               │◀──── user row ────────────────│
  │                               │                               │
  │                               │──── bcrypt.verify() ──────────│
  │                               │    (password + hash)          │
  │                               │                               │
  │                               │──── SELECT subscription ──────▶│
  │                               │     WHERE user_id = $1        │
  │                               │◀──── subscription row ─────────│
  │                               │                               │
  │                               │── Generate access token (JWT) │
  │                               │── Generate refresh token      │
  │                               │── Hash refresh token          │
  │                               │──── INSERT refresh_tokens ────▶│
  │                               │──── UPDATE last_login_at ─────▶│
  │                               │                               │
  │◀── 200 OK ────────────────────│
  │    Body: { user, accessToken, expiresIn }
  │    Cookie: Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth
```

### Auth Flow — Silent Token Refresh

```
Client (on page load)          Backend
  │                               │
  │─── POST /auth/refresh ────────▶
  │    Cookie: refresh_token=...  │
  │    (browser sends automatically)
  │                               │── Extract refresh_token from cookie
  │                               │── Hash token, query refresh_tokens table
  │                               │── Validate: not revoked, not expired
  │                               │── Load user + subscription
  │                               │── Revoke old refresh token
  │                               │── Generate new refresh token (rotation)
  │                               │── Generate new access token
  │                               │── Store new refresh token hash
  │                               │
  │◀── 200 OK ────────────────────│
  │    Body: { user, accessToken, expiresIn }
  │    Cookie: NEW refresh token set
```

### Frontend Auth State Machine

```
APP LOAD
   │
   ▼
[INITIALIZING]
   │
   ├── Call POST /auth/refresh
   │     │
   │     ├── Success → setAuth(user, token) → [AUTHENTICATED]
   │     │
   │     └── Fail (401) → logout() → [UNAUTHENTICATED]
   │
   ▼
[AUTHENTICATED] ←──────────────────────────────────────────────┐
   │                                                            │
   ├── Access token expires (15min)                            │
   │     │                                                     │
   │     └── Axios interceptor auto-refreshes → [REFRESHING]──┘
   │
   ├── Logout clicked
   │     │
   │     └── POST /auth/logout → clear state → [UNAUTHENTICATED]
   │
   └── Refresh fails during auto-refresh
         │
         └── redirect to /login → [UNAUTHENTICATED]
```

---

## 5. Subscription Lifecycle Architecture

### Complete Subscription State Machine

```
[NEVER SUBSCRIBED]
       │
       ├── Signup → plan: FREE, status: FREE
       │
       ▼
    [FREE]
       │
       ├── Starts trial → status: TRIAL
       │       │
       │       ├── Converts → status: ACTIVE, plan: PRO
       │       └── Trial ends (no payment) → status: FREE, plan: FREE
       │
       ├── Subscribes to PRO → Stripe Checkout
       │       │
       │       ▼
       │   [ACTIVE] ←─────────────────────────────────────────┐
       │       │                                              │
       │       ├── Payment succeeds next cycle ───────────────┘
       │       │
       │       ├── Payment fails → status: PAST_DUE
       │       │       │
       │       │       ├── Payment recovered (grace period) → ACTIVE
       │       │       └── Grace period ends → status: EXPIRED → plan: FREE
       │       │
       │       ├── User cancels → cancel_at_period_end: true
       │       │       │
       │       │       ├── Period ends → status: CANCELED → plan: FREE
       │       │       └── User resubscribes before end → ACTIVE (cancel removed)
       │       │
       │       └── Downgrade → plan changes at period end
       │
       └── [CANCELED] / [EXPIRED]
               │
               └── User resubscribes → new Stripe subscription → ACTIVE
```

### Subscription Status → Feature Access Matrix

| Status | Dashboard | Basic Features | Premium Features |
|---|---|---|---|
| FREE | ✓ | ✓ (limited) | ✗ |
| TRIAL | ✓ | ✓ (full) | ✓ (full) |
| ACTIVE | ✓ | ✓ (unlimited) | ✓ (unlimited) |
| PAST_DUE | ✓ | ✓ (limited) | ✗ (grace period) |
| CANCELED | ✓ | ✓ (until end) | ✓ (until end) |
| EXPIRED | ✓ | ✓ (limited) | ✗ |

---

## 6. Stripe Integration Architecture

### Products and Prices Setup

```
Stripe Dashboard Setup:
├── Product: "Lingoura AI Pro"
│   ├── Price: monthly ($19.99/month) → NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
│   └── Price: yearly ($199/year)    → NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
│
└── Product: "Lingoura AI Team" (future)
    ├── Price: per-seat monthly
    └── Price: per-seat yearly
```

### Stripe Checkout Flow

```
Frontend                       Backend                        Stripe
   │                              │                              │
   │── POST /billing/checkout ───▶│                              │
   │   { priceId, successUrl,     │                              │
   │     cancelUrl }              │── Get or create ─────────────▶
   │                              │   Stripe Customer             │
   │                              │◀── customerId ────────────────│
   │                              │                              │
   │                              │── Create Checkout Session ───▶
   │                              │   { customer, priceId,       │
   │                              │     mode: 'subscription',    │
   │                              │     metadata: { userId } }   │
   │                              │◀── { sessionId, url } ────────│
   │                              │                              │
   │◀── { checkoutUrl } ──────────│                              │
   │                              │                              │
   │── Redirect to checkoutUrl ───────────────────────────────────▶
   │                              │                              │
   │◀── User pays ─────────────────────────────────────────────── │
   │                              │                              │
   │─── Redirect to /billing/success?session_id=... ──────────────│
   │                              │                              │
   │   [MEANWHILE]                │◀── webhook: checkout.session.completed
   │                              │── Verify webhook signature   │
   │                              │── Upsert subscription        │
   │                              │── Set plan: PRO, status: ACTIVE
   │                              │── Log billing audit          │
   │                              │── Emit SubscriptionActivated │
```

### Billing Success Page Strategy

The `/billing/success` page must NOT immediately trust the Stripe redirect. It polls backend for subscription confirmation:

```typescript
// features/billing/hooks/useBillingSuccess.ts

export function useBillingSuccess(sessionId: string) {
  const queryClient = useQueryClient();
  const MAX_POLLS = 12;  // 12 × 2.5s = 30s max wait
  
  return useQuery({
    queryKey: ['billing', 'session', sessionId],
    queryFn: () => billingApi.verifyCheckoutSession(sessionId),
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling once subscription is confirmed
      if (data?.status === 'ACTIVE') return false;
      if (query.state.dataUpdateCount >= MAX_POLLS) return false;
      return 2500; // poll every 2.5s
    },
    onSuccess: (data) => {
      if (data.status === 'ACTIVE') {
        // Invalidate all auth/user queries so premium features unlock
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
        queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
      }
    },
  });
}
```

### Webhook Events to Handle

```
checkout.session.completed          → Create/update subscription → ACTIVE
customer.subscription.updated       → Update plan/status/period
customer.subscription.deleted       → Set status → CANCELED/EXPIRED
invoice.payment_succeeded           → Update period dates, clear PAST_DUE
invoice.payment_failed              → Set status → PAST_DUE
customer.subscription.trial_will_end → Send upgrade reminder (email)
invoice.upcoming                    → Upcoming payment notification
```

---

## 7. Frontend Architecture

### Complete Folder Structure

```
src/
│
├── app/                              ← Next.js App Router (routing only)
│   ├── (public)/
│   │   ├── layout.tsx                ← public nav + footer
│   │   ├── page.tsx                  ← landing page
│   │   ├── pricing/
│   │   │   └── page.tsx              ← /pricing
│   │   └── case-studies/
│   │       └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── layout.tsx                ← minimal centered shell
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── (checkout)/
│   │   ├── layout.tsx
│   │   ├── checkout/page.tsx         ← pre-checkout loading state
│   │   ├── billing/
│   │   │   ├── success/page.tsx      ← polls for webhook confirmation
│   │   │   └── cancel/page.tsx       ← abandoned checkout
│   │   └── onboarding/page.tsx       ← post-signup onboarding
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                ← AuthGuard + DashboardLayout
│   │   ├── dashboard/page.tsx
│   │   ├── speaking/page.tsx
│   │   ├── listening/page.tsx
│   │   ├── writing/page.tsx
│   │   ├── reading/page.tsx
│   │   ├── vocabulary/page.tsx
│   │   ├── lessons/page.tsx
│   │   ├── analytics/page.tsx        ← free: basic | pro: full
│   │   ├── progress/page.tsx
│   │   ├── review/page.tsx
│   │   └── settings/
│   │       ├── page.tsx              ← profile settings
│   │       └── billing/page.tsx      ← subscription management
│   │
│   ├── api/
│   │   └── auth/
│   │       └── callback/route.ts     ← Google OAuth callback handler
│   │
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── layout.tsx                    ← root layout (fonts + Providers)
│   └── providers.tsx                 ← ThemeProvider + QueryProvider + AuthInitializer
│
├── features/
│   │
│   ├── auth/                         ← [BUILT] authentication module
│   │   ├── api/auth.api.ts
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── GoogleOAuthButton.tsx
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   ├── useRegister.ts
│   │   │   ├── useLogout.ts
│   │   │   └── useCurrentUser.ts
│   │   ├── schemas/auth.schemas.ts
│   │   ├── store/auth.store.ts
│   │   └── types/auth.types.ts
│   │
│   ├── billing/                      ← [TO BUILD] subscription module
│   │   ├── api/
│   │   │   └── billing.api.ts
│   │   ├── components/
│   │   │   ├── PricingCard.tsx        ← individual plan card
│   │   │   ├── PricingSection.tsx     ← landing + /pricing page section
│   │   │   ├── UpgradeModal.tsx       ← shown when hitting locked feature
│   │   │   ├── UpgradeBanner.tsx      ← dashboard banner for free users
│   │   │   ├── UsageMeter.tsx         ← shows daily usage vs limit
│   │   │   ├── SubscriptionBadge.tsx  ← PRO/FREE badge in header
│   │   │   ├── BillingSuccessView.tsx ← polling confirmation UI
│   │   │   └── BillingPortalButton.tsx← manage subscription button
│   │   ├── hooks/
│   │   │   ├── useSubscription.ts     ← current plan/status query
│   │   │   ├── useCreateCheckout.ts   ← initiates Stripe checkout
│   │   │   ├── useBillingPortal.ts    ← opens Stripe billing portal
│   │   │   ├── useBillingSuccess.ts   ← polls for webhook confirmation
│   │   │   └── useUsageStats.ts       ← daily feature usage
│   │   ├── schemas/
│   │   │   └── billing.schemas.ts
│   │   ├── store/
│   │   │   └── billing.store.ts       ← local billing UI state
│   │   ├── services/
│   │   │   └── plan-features.service.ts ← plan capability queries
│   │   └── types/
│   │       └── billing.types.ts
│   │
│   ├── dashboard/                    ← [BUILT] dashboard module
│   ├── speaking/                     ← [SKELETON] speaking module
│   ├── writing/                      ← [SKELETON]
│   ├── listening/                    ← [SKELETON]
│   ├── reading/                      ← [SKELETON]
│   ├── vocabulary/                   ← [SKELETON]
│   ├── analytics/                    ← [SKELETON] free/pro views
│   └── settings/                     ← [SKELETON]
│
├── shared/                           ← [BUILT] cross-feature infrastructure
│   ├── api/
│   │   ├── axios.ts
│   │   ├── api-client.ts
│   │   ├── endpoints.ts              ← add billing endpoints here
│   │   ├── error-handler.ts
│   │   └── interceptors/
│   │       ├── auth.interceptor.ts
│   │       ├── refresh.interceptor.ts
│   │       └── correlation.interceptor.ts
│   │
│   ├── auth/
│   │   └── guards/
│   │       ├── AuthGuard.tsx         ← [BUILT]
│   │       ├── GuestGuard.tsx        ← [BUILT]
│   │       └── PremiumGuard.tsx      ← [TO BUILD]
│   │
│   ├── components/
│   │   ├── feedback/
│   │   │   ├── PageSkeleton.tsx      ← [BUILT]
│   │   │   ├── ErrorState.tsx        ← [BUILT]
│   │   │   ├── EmptyState.tsx
│   │   │   └── LockedFeatureCard.tsx ← [TO BUILD] premium gate UI
│   │   └── ui/                       ← shadcn/ui components
│   │
│   ├── constants/
│   │   ├── routes.ts                 ← [BUILT]
│   │   ├── app.constants.ts          ← [BUILT]
│   │   ├── query-keys.ts             ← [BUILT] — add billing keys
│   │   └── plan-limits.ts            ← [TO BUILD] FREE tier limits
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useSubscriptionGate.ts    ← [TO BUILD] feature gating hook
│   │
│   ├── layouts/                      ← [BUILT]
│   ├── lib/                          ← [BUILT]
│   ├── providers/                    ← [BUILT]
│   ├── schemas/                      ← shared Zod schemas
│   ├── services/
│   │   └── storage.service.ts        ← [BUILT]
│   ├── store/
│   │   ├── ui.store.ts               ← [BUILT]
│   │   └── preferences.store.ts      ← [BUILT]
│   └── types/
│       ├── api.types.ts              ← [BUILT]
│       ├── auth.types.ts             ← [BUILT]
│       ├── common.types.ts           ← [BUILT]
│       └── billing.types.ts          ← [TO BUILD]
│
├── middleware.ts                     ← [BUILT] Edge route protection
└── env.ts                            ← [BUILT] validated env vars
```

### Billing Feature Module — Complete Implementation

```typescript
// features/billing/types/billing.types.ts

export type SubscriptionPlan = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';
export type SubscriptionStatus = 'FREE' | 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  features: string[];
  isPopular: boolean;
  plan: SubscriptionPlan;
}

export interface UsageStat {
  feature: FeatureKey;
  dailyUsed: number;
  dailyLimit: number | null;  // null = unlimited
  monthlyUsed: number;
  resetAt: string;
}

export type FeatureKey =
  | 'SPEAKING_SESSION'
  | 'AI_CORRECTION'
  | 'VOCABULARY_GENERATION'
  | 'AI_WRITING_REVIEW'
  | 'ADVANCED_ANALYTICS'
  | 'EXPORT_REPORT'
  | 'CEFR_DEEP_ANALYSIS';

export interface CheckoutSession {
  checkoutUrl: string;
  sessionId: string;
}

export interface BillingPortalSession {
  portalUrl: string;
}
```

```typescript
// shared/constants/plan-limits.ts
// Client-side display only — backend enforces the real limits

import type { FeatureKey, SubscriptionPlan } from '@/features/billing/types/billing.types';

type PlanLimits = Record<FeatureKey, number | null>; // null = unlimited

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  FREE: {
    SPEAKING_SESSION:       3,
    AI_CORRECTION:          5,
    VOCABULARY_GENERATION:  10,
    AI_WRITING_REVIEW:      0,   // not available
    ADVANCED_ANALYTICS:     0,
    EXPORT_REPORT:          0,
    CEFR_DEEP_ANALYSIS:     0,
  },
  PRO: {
    SPEAKING_SESSION:       null, // unlimited
    AI_CORRECTION:          null,
    VOCABULARY_GENERATION:  null,
    AI_WRITING_REVIEW:      null,
    ADVANCED_ANALYTICS:     null,
    EXPORT_REPORT:          null,
    CEFR_DEEP_ANALYSIS:     null,
  },
  TEAM: {
    SPEAKING_SESSION:       null,
    AI_CORRECTION:          null,
    VOCABULARY_GENERATION:  null,
    AI_WRITING_REVIEW:      null,
    ADVANCED_ANALYTICS:     null,
    EXPORT_REPORT:          null,
    CEFR_DEEP_ANALYSIS:     null,
  },
  ENTERPRISE: {
    SPEAKING_SESSION:       null,
    AI_CORRECTION:          null,
    VOCABULARY_GENERATION:  null,
    AI_WRITING_REVIEW:      null,
    ADVANCED_ANALYTICS:     null,
    EXPORT_REPORT:          null,
    CEFR_DEEP_ANALYSIS:     null,
  },
};

export function canAccessFeature(plan: SubscriptionPlan, feature: FeatureKey): boolean {
  const limit = PLAN_LIMITS[plan][feature];
  return limit === null || limit > 0;
}

export function getFeatureLimit(plan: SubscriptionPlan, feature: FeatureKey): number | null {
  return PLAN_LIMITS[plan][feature];
}
```

```typescript
// features/billing/api/billing.api.ts

import { post, get } from '@/shared/api/api-client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { Subscription, CheckoutSession, BillingPortalSession, UsageStat } from '../types/billing.types';

export const billingApi = {
  getSubscription: (): Promise<Subscription> =>
    get<Subscription>(API_ENDPOINTS.billing.subscription),

  createCheckoutSession: (priceId: string, billingCycle: 'monthly' | 'yearly'): Promise<CheckoutSession> =>
    post<CheckoutSession>(API_ENDPOINTS.billing.checkout, {
      priceId,
      billingCycle,
      successUrl: `${window.location.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/billing/cancel`,
    }),

  createBillingPortalSession: (): Promise<BillingPortalSession> =>
    post<BillingPortalSession>(API_ENDPOINTS.billing.portal),

  verifyCheckoutSession: (sessionId: string): Promise<Subscription> =>
    get<Subscription>(`${API_ENDPOINTS.billing.verifySession}/${sessionId}`),

  cancelSubscription: (): Promise<void> =>
    post<void>(API_ENDPOINTS.billing.cancel),

  getUsageStats: (): Promise<UsageStat[]> =>
    get<UsageStat[]>(API_ENDPOINTS.billing.usage),
};
```

```typescript
// features/billing/hooks/useSubscription.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { billingApi } from '../api/billing.api';
import { queryKeys } from '@/shared/constants/query-keys';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useSubscription() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.billing.subscription(),
    queryFn: () => billingApi.getSubscription(),
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,  // 5 minutes — subscription rarely changes
    gcTime: 30 * 60_000,
  });
}

export function useIsPro(): boolean {
  const { data } = useSubscription();
  return data?.plan === 'PRO' && data?.status === 'ACTIVE';
}

export function useCanAccess(feature: FeatureKey): boolean {
  const { data } = useSubscription();
  const plan = data?.plan ?? 'FREE';
  return canAccessFeature(plan, feature);
}
```

```typescript
// features/billing/hooks/useCreateCheckout.ts
'use client';

import { useMutation } from '@tanstack/react-query';
import { billingApi } from '../api/billing.api';
import { logger } from '@/shared/lib/logger';
import { analyticsService } from '@/shared/services/analytics.service';

export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({ priceId, billingCycle }: { priceId: string; billingCycle: 'monthly' | 'yearly' }) =>
      billingApi.createCheckoutSession(priceId, billingCycle),

    onSuccess: ({ checkoutUrl }) => {
      analyticsService.track('pro_checkout_started');
      window.location.href = checkoutUrl;
    },

    onError: (error) => {
      logger.error('Failed to create checkout session', error);
    },
  });
}
```

### PremiumGuard Component

```typescript
// shared/auth/guards/PremiumGuard.tsx
'use client';

import { useSubscription, canAccessFeature } from '@/features/billing/hooks/useSubscription';
import { LockedFeatureCard } from '@/shared/components/feedback/LockedFeatureCard';
import type { FeatureKey } from '@/features/billing/types/billing.types';

interface PremiumGuardProps {
  children: React.ReactNode;
  feature: FeatureKey;
  // Optional: custom locked state UI
  lockedFallback?: React.ReactNode;
}

export function PremiumGuard({ children, feature, lockedFallback }: PremiumGuardProps) {
  const { data: subscription, isLoading } = useSubscription();

  if (isLoading) return null;

  const plan = subscription?.plan ?? 'FREE';
  const hasAccess = canAccessFeature(plan, feature);

  if (!hasAccess) {
    return <>{lockedFallback ?? <LockedFeatureCard feature={feature} />}</>;
  }

  return <>{children}</>;
}
```

```typescript
// shared/components/feedback/LockedFeatureCard.tsx
'use client';

import { Lock, Sparkles } from 'lucide-react';
import { useCreateCheckout } from '@/features/billing/hooks/useCreateCheckout';
import { env } from '@/env';
import type { FeatureKey } from '@/features/billing/types/billing.types';

const FEATURE_LABELS: Record<FeatureKey, string> = {
  SPEAKING_SESSION: 'Unlimited Speaking Sessions',
  AI_CORRECTION: 'Advanced AI Corrections',
  VOCABULARY_GENERATION: 'Unlimited Vocabulary Generation',
  AI_WRITING_REVIEW: 'AI Writing Review',
  ADVANCED_ANALYTICS: 'Advanced Analytics',
  EXPORT_REPORT: 'Export Reports',
  CEFR_DEEP_ANALYSIS: 'CEFR Deep Analysis',
};

export function LockedFeatureCard({ feature }: { feature: FeatureKey }) {
  const checkout = useCreateCheckout();

  return (
    <div className="relative rounded-3xl border border-indigo-200/60 dark:border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/5 p-8 flex flex-col items-center text-center gap-4 overflow-hidden">
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
          <Lock size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="font-bold text-on-surface">{FEATURE_LABELS[feature]}</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            This feature is available on the Pro plan.
          </p>
        </div>
        <button
          onClick={() => checkout.mutate({
            priceId: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
            billingCycle: 'monthly',
          })}
          disabled={checkout.isPending}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          <Sparkles size={15} />
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
```

### Usage Meter Component

```typescript
// features/billing/components/UsageMeter.tsx
'use client';

import { useUsageStats } from '../hooks/useUsageStats';
import type { FeatureKey } from '../types/billing.types';
import { cn } from '@/shared/lib/utils';

interface UsageMeterProps {
  feature: FeatureKey;
  label: string;
}

export function UsageMeter({ feature, label }: UsageMeterProps) {
  const { data: stats } = useUsageStats();
  const stat = stats?.find((s) => s.feature === feature);

  if (!stat || stat.dailyLimit === null) return null; // unlimited — don't show

  const percent = Math.min((stat.dailyUsed / stat.dailyLimit) * 100, 100);
  const isNearLimit = percent >= 80;
  const isAtLimit = percent >= 100;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-on-surface-variant">{label}</span>
        <span className={cn(
          'font-bold',
          isAtLimit ? 'text-red-500' : isNearLimit ? 'text-amber-500' : 'text-on-surface-variant'
        )}>
          {stat.dailyUsed} / {stat.dailyLimit}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-indigo-500'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
```

---

## 8. Backend Architecture

### ASP.NET Core 9 — Clean Architecture Layer Map

```
LingouraAI.sln
├── src/
│   ├── LingouraAI.Domain/                 ← Entities, value objects, domain events
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Subscription.cs
│   │   │   ├── RefreshToken.cs
│   │   │   └── UsageRecord.cs
│   │   ├── Enums/
│   │   │   ├── SubscriptionPlan.cs
│   │   │   ├── SubscriptionStatus.cs
│   │   │   └── FeatureKey.cs
│   │   ├── Events/
│   │   │   ├── SubscriptionActivatedEvent.cs
│   │   │   └── SubscriptionCanceledEvent.cs
│   │   └── Exceptions/
│   │       ├── SubscriptionRequiredException.cs
│   │       └── UsageLimitExceededException.cs
│   │
│   ├── LingouraAI.Application/            ← CQRS commands/queries, use cases
│   │   ├── Features/
│   │   │   ├── Auth/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── Login/
│   │   │   │   │   ├── Register/
│   │   │   │   │   ├── Refresh/
│   │   │   │   │   └── Logout/
│   │   │   │   └── Queries/
│   │   │   │       └── GetCurrentUser/
│   │   │   ├── Billing/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreateCheckoutSession/
│   │   │   │   │   ├── CreateBillingPortalSession/
│   │   │   │   │   ├── CancelSubscription/
│   │   │   │   │   └── ProcessWebhookEvent/
│   │   │   │   └── Queries/
│   │   │   │       ├── GetSubscription/
│   │   │   │       └── GetUsageStats/
│   │   │   └── Speaking/
│   │   │       └── Commands/
│   │   │           └── CreateSpeakingSession/
│   │   ├── Common/
│   │   │   ├── Interfaces/
│   │   │   │   ├── ICurrentUserService.cs
│   │   │   │   ├── ISubscriptionService.cs
│   │   │   │   ├── IStripeService.cs
│   │   │   │   └── IUsageTrackingService.cs
│   │   │   └── Behaviours/
│   │   │       ├── ValidationBehaviour.cs
│   │   │       ├── AuthorizationBehaviour.cs    ← checks subscription via MediatR pipeline
│   │   │       └── UsageLimitBehaviour.cs       ← checks + increments usage
│   │   └── DTOs/
│   │
│   ├── LingouraAI.Infrastructure/         ← EF Core, Stripe SDK, external services
│   │   ├── Persistence/
│   │   │   ├── LingouraDbContext.cs
│   │   │   ├── Repositories/
│   │   │   └── Migrations/
│   │   ├── Services/
│   │   │   ├── TokenService.cs            ← JWT generation and validation
│   │   │   ├── StripeService.cs           ← Stripe SDK wrapper
│   │   │   ├── UsageTrackingService.cs    ← atomic usage increment + reset
│   │   │   └── CurrentUserService.cs      ← extracts user from HttpContext
│   │   └── BackgroundJobs/
│   │       └── SubscriptionExpiryJob.cs   ← daily cron: check expired subs
│   │
│   └── LingouraAI.API/                    ← Controllers, middleware, DI, startup
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   ├── BillingController.cs
│       │   ├── SpeakingController.cs
│       │   └── AnalyticsController.cs
│       ├── Middleware/
│       │   ├── CorrelationIdMiddleware.cs
│       │   └── ExceptionHandlingMiddleware.cs
│       ├── Filters/
│       │   └── SubscriptionAuthorizationFilter.cs
│       └── Program.cs
```

### Subscription Authorization Policy (C#)

```csharp
// LingouraAI.API/Authorization/SubscriptionRequirements.cs

public class SubscriptionRequirement : IAuthorizationRequirement
{
    public SubscriptionPlan MinimumPlan { get; }

    public SubscriptionRequirement(SubscriptionPlan minimumPlan)
    {
        MinimumPlan = minimumPlan;
    }
}

public class SubscriptionAuthorizationHandler
    : AuthorizationHandler<SubscriptionRequirement>
{
    private readonly ISubscriptionService _subscriptionService;
    private readonly ICurrentUserService _currentUser;

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SubscriptionRequirement requirement)
    {
        var userId = _currentUser.UserId;
        var subscription = await _subscriptionService.GetActiveSubscriptionAsync(userId);

        if (subscription == null || !IsStatusAllowed(subscription.Status))
        {
            context.Fail();
            return;
        }

        if (!MeetsPlanRequirement(subscription.Plan, requirement.MinimumPlan))
        {
            context.Fail();
            return;
        }

        context.Succeed(requirement);
    }

    private static bool IsStatusAllowed(SubscriptionStatus status) =>
        status is SubscriptionStatus.Active
               or SubscriptionStatus.Trial
               or SubscriptionStatus.Canceled; // still within period

    private static bool MeetsPlanRequirement(SubscriptionPlan actual, SubscriptionPlan required) =>
        (int)actual >= (int)required; // enum ordering matters
}

// Usage on controllers:
[Authorize]
[RequireSubscription(SubscriptionPlan.Pro)]  // Custom attribute backed by policy
public async Task<IActionResult> GetAdvancedAnalytics()
{
    // Backend already validated — safe to serve
}
```

### Usage Tracking — Atomic Increment (C#)

```csharp
// LingouraAI.Infrastructure/Services/UsageTrackingService.cs

public class UsageTrackingService : IUsageTrackingService
{
    private readonly LingouraDbContext _db;

    public async Task<UsageCheckResult> CheckAndIncrementAsync(
        Guid userId,
        FeatureKey feature,
        CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Upsert with atomic increment — prevents race conditions
        var sql = """
            INSERT INTO usage_records (id, user_id, feature, date, daily_count, last_used_at, reset_at)
            VALUES (gen_random_uuid(), @userId, @feature, @today, 1, NOW(), NOW())
            ON CONFLICT (user_id, feature, date)
            DO UPDATE SET
                daily_count = usage_records.daily_count + 1,
                last_used_at = NOW()
            RETURNING daily_count
            """;

        var count = await _db.Database
            .SqlQueryRaw<int>(sql, userId, feature.ToString(), today)
            .FirstAsync(ct);

        var limit = GetDailyLimit(feature, userId); // from subscription
        return new UsageCheckResult
        {
            CurrentCount = count,
            DailyLimit = limit,
            IsExceeded = limit.HasValue && count > limit.Value,
        };
    }
}
```

### Webhook Processing (C#)

```csharp
// LingouraAI.Application/Features/Billing/Commands/ProcessWebhookEvent/

public class ProcessWebhookEventCommand : IRequest<Unit>
{
    public string EventId { get; init; } = string.Empty;
    public string EventType { get; init; } = string.Empty;
    public JsonDocument Payload { get; init; } = null!;
}

public class ProcessWebhookEventHandler : IRequestHandler<ProcessWebhookEventCommand, Unit>
{
    private readonly LingouraDbContext _db;
    private readonly ILogger<ProcessWebhookEventHandler> _logger;

    public async Task<Unit> Handle(ProcessWebhookEventCommand request, CancellationToken ct)
    {
        // IDEMPOTENCY: skip already-processed events
        var existingEvent = await _db.WebhookEvents
            .FirstOrDefaultAsync(e => e.EventId == request.EventId, ct);

        if (existingEvent?.Status == WebhookEventStatus.Processed)
        {
            _logger.LogInformation("Skipping duplicate webhook event {EventId}", request.EventId);
            return Unit.Value;
        }

        // Record event
        var webhookEvent = existingEvent ?? new WebhookEvent
        {
            EventId = request.EventId,
            EventType = request.EventType,
            Payload = request.Payload,
        };
        webhookEvent.Status = WebhookEventStatus.Pending;
        _db.WebhookEvents.Add(webhookEvent);
        await _db.SaveChangesAsync(ct);

        try
        {
            await DispatchEvent(request.EventType, request.Payload, ct);
            webhookEvent.Status = WebhookEventStatus.Processed;
            webhookEvent.ProcessedAt = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            webhookEvent.Status = WebhookEventStatus.Failed;
            webhookEvent.ErrorMessage = ex.Message;
            _logger.LogError(ex, "Failed to process webhook event {EventId}", request.EventId);
            throw; // Return 500 to Stripe — it will retry
        }
        finally
        {
            await _db.SaveChangesAsync(ct);
        }

        return Unit.Value;
    }

    private async Task DispatchEvent(string eventType, JsonDocument payload, CancellationToken ct)
    {
        switch (eventType)
        {
            case "checkout.session.completed":
                await HandleCheckoutCompleted(payload, ct);
                break;
            case "customer.subscription.updated":
                await HandleSubscriptionUpdated(payload, ct);
                break;
            case "customer.subscription.deleted":
                await HandleSubscriptionDeleted(payload, ct);
                break;
            case "invoice.payment_failed":
                await HandlePaymentFailed(payload, ct);
                break;
            default:
                // Log but don't fail — we may add more event types later
                _logger.LogDebug("Unhandled webhook event type: {EventType}", eventType);
                break;
        }
    }
}
```

---

## 9. Middleware & Route Protection Strategy

### Three-Layer Protection

```
REQUEST
   │
   ▼ LAYER 1 — Next.js Edge Middleware (fastest, before page renders)
┌──────────────────────────────────────────────────────┐
│ src/middleware.ts                                     │
│ Checks: lingoura_session httpOnly cookie presence     │
│ No JWT validation (Edge runtime can't run RS256)     │
│ Purpose: UX redirect, prevents flash of auth pages   │
│ Not security — cookie can be forged by attacker      │
└──────────────────────────────────────────────────────┘
   │
   ▼ LAYER 2 — Client Guard Components (UX, not security)
┌──────────────────────────────────────────────────────┐
│ AuthGuard.tsx / PremiumGuard.tsx                     │
│ Reads Zustand auth store                             │
│ Shows loading state during session restoration       │
│ Redirects unauthenticated users                      │
│ Shows locked feature UI for insufficient plan        │
│ Purpose: UX — prevents content flash, smooth flow    │
│ Not security — client JS is controllable             │
└──────────────────────────────────────────────────────┘
   │
   ▼ LAYER 3 — Backend API Authorization (only real security)
┌──────────────────────────────────────────────────────┐
│ ASP.NET Core Authorization Middleware                │
│ Validates: JWT signature, expiry, claims             │
│ Validates: subscription status and plan              │
│ Validates: usage limits                              │
│ Returns: 401 / 403 / 429 appropriately               │
│ Purpose: SECURITY — cannot be bypassed               │
└──────────────────────────────────────────────────────┘
```

### Middleware Route Matrix

```typescript
// src/middleware.ts — complete route classification

const ROUTE_CONFIG = {
  // Accessible only when NOT authenticated
  guestOnly: ['/login', '/register', '/forgot-password'],

  // Accessible only when authenticated
  protected: [
    '/dashboard', '/speaking', '/listening', '/writing',
    '/reading', '/vocabulary', '/lessons', '/analytics',
    '/progress', '/review', '/settings',
    '/billing', '/onboarding',
  ],

  // Accessible to all (no redirect logic)
  public: ['/', '/pricing', '/case-studies', '/billing/success', '/billing/cancel'],
} as const;
```

---

## 10. Feature Gating Architecture

### The Gating Hook

```typescript
// shared/hooks/useSubscriptionGate.ts
'use client';

import { useSubscription } from '@/features/billing/hooks/useSubscription';
import { useUiStore } from '@/shared/store/ui.store';
import { canAccessFeature } from '@/shared/constants/plan-limits';
import { analyticsService } from '@/shared/services/analytics.service';
import type { FeatureKey } from '@/features/billing/types/billing.types';

interface GateResult {
  canAccess: boolean;
  isLoading: boolean;
  requireUpgrade: () => void;
}

export function useSubscriptionGate(feature: FeatureKey): GateResult {
  const { data: subscription, isLoading } = useSubscription();
  const { openModal } = useUiStore();

  const plan = subscription?.plan ?? 'FREE';
  const canAccess = canAccessFeature(plan, feature);

  function requireUpgrade() {
    analyticsService.track('premium_feature_clicked', { feature });
    openModal('upgrade-modal');
  }

  return { canAccess, isLoading, requireUpgrade };
}
```

### Usage Pattern — Gating a Button

```typescript
// features/speaking/components/AdvancedFeedbackButton.tsx
'use client';

import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate';

export function AdvancedFeedbackButton() {
  const { canAccess, requireUpgrade } = useSubscriptionGate('AI_CORRECTION');

  if (!canAccess) {
    return (
      <button
        onClick={requireUpgrade}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition-colors"
      >
        <Lock size={14} />
        Upgrade for Advanced Feedback
      </button>
    );
  }

  return (
    <button onClick={handleGetFeedback} className="...">
      Get AI Feedback
    </button>
  );
}
```

### Usage Pattern — Gating an Entire Page Section

```tsx
// app/(dashboard)/analytics/page.tsx
import { PremiumGuard } from '@/shared/auth/guards/PremiumGuard';
import { BasicAnalytics } from '@/features/analytics/components/BasicAnalytics';
import { AdvancedAnalytics } from '@/features/analytics/components/AdvancedAnalytics';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Always visible — free tier */}
      <BasicAnalytics />

      {/* Locked behind Pro — shows LockedFeatureCard if free */}
      <PremiumGuard feature="ADVANCED_ANALYTICS">
        <AdvancedAnalytics />
      </PremiumGuard>
    </div>
  );
}
```

---

## 11. Usage Limit Architecture

### Client-Side Usage Display

```typescript
// features/billing/hooks/useUsageStats.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { billingApi } from '../api/billing.api';
import { queryKeys } from '@/shared/constants/query-keys';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useUsageStats() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.billing.usage(),
    queryFn: () => billingApi.getUsageStats(),
    enabled: isAuthenticated,
    staleTime: 30_000,  // refresh every 30s — usage changes frequently
    refetchOnWindowFocus: true,
  });
}
```

### Usage Limit Enforcement Flow

```
API Request: POST /api/speaking/sessions
   │
   ▼
[AuthorizationBehaviour] — validates JWT
   │
   ▼
[UsageLimitBehaviour] — MediatR pipeline behaviour
   │
   ├── Get user's subscription plan
   ├── Get daily limit for SPEAKING_SESSION on FREE plan (= 3)
   ├── Atomically increment + read today's count
   │     (PostgreSQL UPSERT — race-condition safe)
   │
   ├── count > limit?
   │     ├── YES → throw UsageLimitExceededException
   │     │         → Response: 429 Too Many Requests
   │     │           { message, feature, limit, resetAt }
   │     └── NO  → continue to handler
   │
   ▼
[Handler] — executes speaking session creation
```

### Server Response on Limit Exceeded

```json
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1716163200

{
  "success": false,
  "code": "USAGE_LIMIT_EXCEEDED",
  "message": "You've used 3/3 speaking sessions today.",
  "data": {
    "feature": "SPEAKING_SESSION",
    "dailyLimit": 3,
    "dailyUsed": 3,
    "resetAt": "2026-05-17T00:00:00Z",
    "upgradeUrl": "/pricing"
  }
}
```

### Frontend Handling of 429

```typescript
// shared/api/error-handler.ts — extend to handle 429

export function parseApiError(error: unknown): ApiError {
  if (isAxiosError(error) && error.response) {
    const { status, data } = error.response;

    if (status === 429) {
      return {
        message: data?.message ?? 'Daily limit reached.',
        code: 'USAGE_LIMIT_EXCEEDED',
        status: 429,
        meta: {
          feature: data?.data?.feature,
          resetAt: data?.data?.resetAt,
          upgradeUrl: data?.data?.upgradeUrl,
        },
      };
    }
    // ... rest of error handling
  }
}
```

---

## 12. Webhook Architecture

### Webhook Controller (ASP.NET Core)

```csharp
// LingouraAI.API/Controllers/BillingController.cs

[ApiController]
[Route("api/billing")]
public class BillingController : ControllerBase
{
    [HttpPost("webhooks/stripe")]
    [AllowAnonymous] // ← NOT protected by JWT — Stripe can't authenticate
    public async Task<IActionResult> StripeWebhook()
    {
        var payload = await new StreamReader(Request.Body).ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"].FirstOrDefault();

        StripeEvent stripeEvent;
        try
        {
            // CRITICAL: verify Stripe signature before ANY processing
            stripeEvent = EventUtility.ConstructEvent(
                payload,
                signature,
                _stripeOptions.WebhookSecret,
                throwOnApiVersionMismatch: false
            );
        }
        catch (StripeException ex)
        {
            _logger.LogWarning("Invalid Stripe webhook signature: {Message}", ex.Message);
            return BadRequest("Invalid webhook signature.");
        }

        // Process asynchronously via MediatR
        await _mediator.Send(new ProcessWebhookEventCommand
        {
            EventId = stripeEvent.Id,
            EventType = stripeEvent.Type,
            Payload = JsonDocument.Parse(payload),
        });

        // Always return 200 to Stripe immediately
        // If processing fails, we return 500 so Stripe retries
        return Ok();
    }
}
```

### Webhook Reliability Architecture

```
Stripe sends event
       │
       ▼
Backend receives POST /api/billing/webhooks/stripe
       │
       ▼
Verify Stripe-Signature header (HMAC-SHA256)
       │ Invalid → 400 Bad Request (discard)
       │ Valid   ↓
       ▼
Check webhook_events table for event_id (idempotency)
       │ Already processed → 200 OK (skip)
       │ New event         ↓
       ▼
Insert record with status=PENDING
       │
       ▼
Process event (update subscription table)
       │
       ├── Success → status=PROCESSED → 200 OK
       │
       └── Error → status=FAILED → 500 (Stripe will retry)
                   (Stripe retries with exponential backoff over 3 days)
```

### Stripe Retry Configuration

Stripe retries failed webhooks at: 5s → 30s → 2m → 10m → 30m → 2h → 5h → 10h → 24h

Our webhook processing is **idempotent** — if Stripe retries after a partial failure, the `UPSERT` operations are safe to re-run.

---

## 13. React Query Strategy

### Query Key Factory (complete)

```typescript
// shared/constants/query-keys.ts

export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  billing: {
    subscription: () => ['billing', 'subscription'] as const,
    usage: () => ['billing', 'usage'] as const,
    session: (sessionId: string) => ['billing', 'session', sessionId] as const,
  },
  dashboard: {
    stats: () => ['dashboard', 'stats'] as const,
    activity: (period: string) => ['dashboard', 'activity', period] as const,
  },
  speaking: {
    sessions: () => ['speaking', 'sessions'] as const,
    session: (id: string) => ['speaking', 'sessions', id] as const,
  },
  analytics: {
    overview: () => ['analytics', 'overview'] as const,
    advanced: () => ['analytics', 'advanced'] as const,
  },
} as const;
```

### Post-Payment Cache Invalidation

```typescript
// After Stripe payment confirmed:
queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
queryClient.invalidateQueries({ queryKey: queryKeys.billing.usage() });
queryClient.invalidateQueries({ queryKey: queryKeys.analytics.advanced() });
```

### Subscription Data in JWT (performance optimization)

The access token includes `plan` and `status` claims. This means:
- The `useSubscription` query can be seeded from auth state on page load
- No extra API call needed for basic plan checks
- Full subscription detail (period dates, cancel status) still requires the API

```typescript
// features/auth/store/auth.store.ts
// Extend to include subscription state from JWT
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  // From JWT claims — fast access, no extra API call
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
}
```

### Cache Sharing — Multiple Tabs

For subscription state consistency across browser tabs, use the `BroadcastChannel` API:

```typescript
// shared/services/sync.service.ts
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryKeys } from '@/shared/constants/query-keys';

const SYNC_CHANNEL = 'lingoura-sync';

export function useCrossTabSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = new BroadcastChannel(SYNC_CHANNEL);

    channel.onmessage = (event) => {
      if (event.data.type === 'SUBSCRIPTION_UPDATED') {
        queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      }
      if (event.data.type === 'LOGOUT') {
        queryClient.clear();
      }
    };

    return () => channel.close();
  }, [queryClient]);

  return {
    broadcastSubscriptionUpdate: () => {
      const channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.postMessage({ type: 'SUBSCRIPTION_UPDATED' });
      channel.close();
    },
    broadcastLogout: () => {
      const channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.postMessage({ type: 'LOGOUT' });
      channel.close();
    },
  };
}
```

---

## 14. Zustand State Model

### Auth Store (extended with subscription)

```typescript
// features/auth/store/auth.store.ts

import type { User, SubscriptionPlan, SubscriptionStatus } from '@/shared/types/auth.types';

interface AuthState {
  // Identity
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  // Subscription (from JWT claims — for fast UI decisions)
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;

  // Actions
  setAuth: (user: User, token: string) => void;
  setTokens: (token: string) => void;
  logout: () => void;
  setInitializing: (value: boolean) => void;
}

// JWT payload parsing (after verify):
function extractSubscriptionFromToken(token: string): {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
} {
  const parts = token.split('.');
  if (parts.length !== 3) return { plan: 'FREE', status: 'FREE' };
  try {
    const payload = JSON.parse(atob(parts[1] ?? ''));
    return {
      plan: payload.plan ?? 'FREE',
      status: payload.subscription_status ?? 'FREE',
    };
  } catch {
    return { plan: 'FREE', status: 'FREE' };
  }
}
```

### Billing UI Store

```typescript
// features/billing/store/billing.store.ts

import { create } from 'zustand';

interface BillingUiState {
  isUpgradeModalOpen: boolean;
  pendingFeature: string | null;     // which feature triggered the modal
  checkoutSessionId: string | null;  // for billing/success polling
  isCheckoutPending: boolean;

  openUpgradeModal: (feature?: string) => void;
  closeUpgradeModal: () => void;
  setCheckoutSession: (sessionId: string) => void;
  setCheckoutPending: (pending: boolean) => void;
}

export const useBillingStore = create<BillingUiState>((set) => ({
  isUpgradeModalOpen: false,
  pendingFeature: null,
  checkoutSessionId: null,
  isCheckoutPending: false,

  openUpgradeModal: (feature) => set({ isUpgradeModalOpen: true, pendingFeature: feature ?? null }),
  closeUpgradeModal: () => set({ isUpgradeModalOpen: false, pendingFeature: null }),
  setCheckoutSession: (sessionId) => set({ checkoutSessionId: sessionId }),
  setCheckoutPending: (pending) => set({ isCheckoutPending: pending }),
}));
```

---

## 15. Edge Case Handling

### Case 1 — Webhook Delayed After Payment

**Problem:** User pays, browser redirects to `/billing/success`, but webhook hasn't processed yet. Subscription still shows FREE.

**Solution:** Polling with timeout

```typescript
// features/billing/hooks/useBillingSuccess.ts

export function useBillingSuccess(sessionId: string) {
  const [pollCount, setPollCount] = useState(0);
  const MAX_POLLS = 15; // 15 × 2s = 30s

  const query = useQuery({
    queryKey: queryKeys.billing.session(sessionId),
    queryFn: () => billingApi.verifyCheckoutSession(sessionId),
    refetchInterval: (q) => {
      if (q.state.data?.status === 'ACTIVE') return false;
      if (pollCount >= MAX_POLLS) return false;
      setPollCount((c) => c + 1);
      return 2000;
    },
  });

  const isConfirmed = query.data?.status === 'ACTIVE';
  const isTimedOut = !isConfirmed && pollCount >= MAX_POLLS;

  return { query, isConfirmed, isTimedOut, pollCount };
}
```

**UI States:**

```
Polling:   "Activating your Pro subscription..."  [spinner]
Confirmed: "You're now Pro! Redirecting..."       [checkmark]
Timed out: "Still processing — check back in a moment or contact support"
```

---

### Case 2 — Browser Closed During Checkout

**Problem:** User starts checkout, closes browser, opens app again.

**Result:** 
- Stripe Checkout session expires (24 hours)
- User is still FREE (no payment confirmed)
- User account exists and is intact
- On next login, user lands in dashboard as FREE user
- Upgrade prompt visible in dashboard

**No special handling needed.** The system is stateless enough that abandonment is safe.

---

### Case 3 — Subscription Expires Silently

**Problem:** Subscription expires while user is using the app.

**Flow:**
1. Stripe sends `customer.subscription.deleted` or `invoice.payment_failed` (exhausted retries)
2. Backend webhook processes → sets `status: EXPIRED`, `plan: FREE`
3. Next API call from frontend returns 403 on premium endpoints
4. Axios interceptor detects 403 → calls `queryClient.invalidateQueries(queryKeys.auth.me())`
5. User state refreshes → UI reflects FREE plan
6. Premium sections show `LockedFeatureCard`

```typescript
// shared/api/interceptors/subscription.interceptor.ts

export function attachSubscriptionInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 403) {
        const data = error.response.data as { code?: string };
        if (data?.code === 'SUBSCRIPTION_REQUIRED') {
          // Subscription changed server-side — refresh local state
          queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
          queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
        }
      }
      return Promise.reject(error);
    }
  );
}
```

---

### Case 4 — Multiple Browser Tabs

**Problem:** User upgrades in Tab A. Tab B still shows FREE.

**Solution:** BroadcastChannel (implemented in Section 13)

```typescript
// After successful checkout confirmation:
broadcastSubscriptionUpdate(); // notifies all other tabs
```

---

### Case 5 — Network Failure During Payment

**Problem:** Network drops after payment completes but before redirect.

**Result:**
- Stripe receives payment → sends webhook
- Backend processes webhook → subscription activated
- User is Pro (server-side)
- User sees no redirect

**Recovery:**
1. User refreshes app → `AuthInitializer` calls `/auth/refresh`
2. New JWT includes `plan: PRO` claim
3. UI immediately reflects Pro status

No special handling needed — webhook-driven architecture makes this naturally resilient.

---

### Case 6 — Concurrent API Requests After 401

**Problem:** Multiple API calls fire simultaneously. All get 401. Multiple refresh attempts would race.

**Already handled** in `refresh.interceptor.ts` via the `isRefreshing` flag and `failedQueue` pattern. All queued requests wait for the single refresh to complete, then replay with the new token.

---

## 16. Security Architecture

### Threat Model

| Threat | Attack Vector | Mitigation |
|---|---|---|
| Token theft via XSS | Malicious script reads localStorage | Access token in memory only (Zustand) |
| Session hijacking | Steal httpOnly cookie | `Secure` + `SameSite=Strict` — not readable via JS, not sent cross-origin |
| CSRF on refresh | Forged cross-origin request | `SameSite=Strict` blocks cross-site cookie sending |
| Subscription bypass | User modifies JWT claim in DevTools | Backend re-validates JWT signature on every request |
| Fake PRO access | Frontend plan check bypassed | All premium endpoints validate subscription server-side |
| Webhook spoofing | Fake Stripe webhook | HMAC-SHA256 signature verification before any processing |
| Replay attacks | Re-send captured webhook | Idempotency log in `webhook_events` table |
| Token replay after logout | Use stolen token | Short expiry (15min) + JWT ID (`jti`) revocation list (Redis) |
| Brute force login | Mass password attempts | FluentValidation rate limiting (429 on lockout — already implemented) |
| SQL injection | Malicious input | Parameterized queries via EF Core — no raw SQL except atomic usage |
| Enumeration attack | Try emails to check accounts | Consistent response time on login regardless of user existence |
| Insecure redirects | Redirect to external site | Redirect targets validated against allowlist |

### JWT Security Configuration

```csharp
// Token generation — use RS256 (asymmetric)
// Private key signs tokens (API only)
// Public key verifies tokens (can be distributed to other services)

var tokenDescriptor = new SecurityTokenDescriptor
{
    Subject = new ClaimsIdentity(new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim("role", user.Role.ToString()),
        new Claim("plan", subscription.Plan.ToString()),
        new Claim("subscription_status", subscription.Status.ToString()),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    }),
    Expires = DateTime.UtcNow.AddMinutes(15),     // SHORT expiry
    SigningCredentials = new SigningCredentials(privateKey, SecurityAlgorithms.RsaSha256),
    Issuer = "https://api.lingoura.ai",
    Audience = "https://app.lingoura.ai",
};
```

### Frontend Security Checklist

- [ ] No tokens in `localStorage` or `sessionStorage`
- [ ] No tokens in URL query strings
- [ ] `X-Correlation-Id` on all requests (audit trail)
- [ ] CSP headers block inline scripts not from our domain
- [ ] `X-Frame-Options: SAMEORIGIN` — prevents clickjacking
- [ ] `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- [ ] Stripe Checkout is hosted by Stripe — card data never touches our frontend
- [ ] Google OAuth redirect URI validated server-side
- [ ] Redirect parameter validated against internal routes allowlist
- [ ] No `dangerouslySetInnerHTML` anywhere in the codebase
- [ ] All user-input displayed via React (auto-escaped)

---

## 17. API Contract Reference

### Auth Endpoints

```
POST /api/auth/login
Body:    { email: string, password: string }
Success: 200 { data: { user: User, accessToken: string, expiresIn: number } }
         Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict
Errors:  400 validation | 401 invalid credentials | 429 rate limited

POST /api/auth/register
Body:    { displayName: string, email: string, password: string }
Success: 201 { data: { user: User, accessToken: string, expiresIn: number } }
Errors:  400 validation | 409 email already exists

POST /api/auth/refresh
Body:    (empty — refresh token from cookie)
Success: 200 { data: { user: User, accessToken: string, expiresIn: number } }
         Set-Cookie: NEW refresh_token
Errors:  401 no/invalid/expired refresh token

POST /api/auth/logout
Headers: Authorization: Bearer <token>
Body:    (empty)
Success: 204
         Set-Cookie: refresh_token=; Max-Age=0 (delete cookie)

GET /api/auth/me
Headers: Authorization: Bearer <token>
Success: 200 { data: User }
Errors:  401

POST /api/auth/google/callback
Body:    { code: string }
Success: 200 { data: { user: User, accessToken: string, expiresIn: number } }
Errors:  400 | 409
```

### Billing Endpoints

```
GET /api/billing/subscription
Headers: Authorization: Bearer <token>
Success: 200 { data: Subscription }

POST /api/billing/checkout
Headers: Authorization: Bearer <token>
Body:    { priceId: string, billingCycle: 'monthly' | 'yearly', successUrl: string, cancelUrl: string }
Success: 200 { data: { checkoutUrl: string, sessionId: string } }

GET /api/billing/session/:sessionId
Headers: Authorization: Bearer <token>
Success: 200 { data: Subscription }  ← polls until status = ACTIVE
Errors:  404 session not found

POST /api/billing/portal
Headers: Authorization: Bearer <token>
Body:    { returnUrl: string }
Success: 200 { data: { portalUrl: string } }

POST /api/billing/cancel
Headers: Authorization: Bearer <token>
Success: 200 { data: { cancelAtPeriodEnd: boolean, periodEnd: string } }

GET /api/billing/usage
Headers: Authorization: Bearer <token>
Success: 200 { data: UsageStat[] }

POST /api/billing/webhooks/stripe
Headers: Stripe-Signature: t=...,v1=...
Body:    (raw Stripe JSON payload)
Success: 200
Errors:  400 invalid signature | 500 processing failed (Stripe will retry)
```

### Premium Feature Endpoint Example

```
POST /api/speaking/sessions
Headers: Authorization: Bearer <token>
Body:    { duration: number, mode: 'free' | 'guided' }
Success: 200 { data: SpeakingSession }
Errors:  401 unauthenticated
         403 { code: 'SUBSCRIPTION_REQUIRED', requiredPlan: 'PRO' }   (for advanced modes)
         429 { code: 'USAGE_LIMIT_EXCEEDED', feature: 'SPEAKING_SESSION',
                dailyLimit: 3, dailyUsed: 3, resetAt: '...' }
```

---

## 18. Sequence Diagrams

### Flow 1 — New User Signs Up as Free

```
Browser              Frontend              Backend              Database
   │                     │                     │                    │
   │─── Clicks ──────────▶                     │                    │
   │   "Start Free"       │                    │                    │
   │                      │── navigate /register                    │
   │◀── Register form ────│                    │                    │
   │                      │                    │                    │
   │─── Fills form ───────▶                    │                    │
   │                      │── POST /auth/register ─────────────────▶│
   │                      │                    │── INSERT user ─────▶│
   │                      │                    │── INSERT subscription
   │                      │                    │   plan:FREE, status:FREE
   │                      │                    │── INSERT refresh_token
   │                      │                    │◀──────────────────────
   │                      │◀── 201 { user, accessToken }
   │                      │    Cookie: refresh_token
   │                      │                    │                    │
   │                      │── setAuth(user, token)                  │
   │                      │── navigate /onboarding                  │
   │◀── Onboarding page ──│                    │                    │
   │                      │                    │                    │
   │─── Completes ────────▶                    │                    │
   │                      │── navigate /dashboard                   │
   │◀── Dashboard (FREE) ─│                    │                    │
```

### Flow 2 — Free User Upgrades to Pro

```
Browser              Frontend              Backend              Stripe              Database
   │                     │                     │                    │                    │
   │─── Clicks ──────────▶                     │                    │                    │
   │  "Upgrade to Pro"    │                    │                    │                    │
   │                      │── POST /billing/checkout ──────────────▶│                    │
   │                      │                    │── Get/create ──────▶│                    │
   │                      │                    │   Stripe Customer   │                    │
   │                      │                    │── Create Session ───▶│                    │
   │                      │                    │◀── { url, id } ─────│                    │
   │                      │◀── { checkoutUrl } │                    │                    │
   │                      │                    │                    │                    │
   │◀── Redirect ─────────│                    │                    │                    │
   │   to Stripe Checkout │                    │                    │                    │
   │                      │                    │                    │                    │
   │─── User pays ─────────────────────────────────────────────────▶│                    │
   │                      │                    │                    │                    │
   │                      │                    │◀── Webhook ─────────│                    │
   │                      │                    │  checkout.session.completed             │
   │                      │                    │── Verify signature  │                    │
   │                      │                    │── UPDATE subscription ──────────────────▶│
   │                      │                    │   plan:PRO, status:ACTIVE               │
   │                      │                    │── INSERT billing_audit_log ─────────────▶│
   │                      │                    │── 200 OK ───────────│                    │
   │                      │                    │                    │                    │
   │◀── Redirect ──────────────────────────────│                    │                    │
   │   /billing/success?session_id=...         │                    │                    │
   │                      │                    │                    │                    │
   │                      │── Poll GET /billing/session/:id (every 2s)                  │
   │                      │◀── { status: 'ACTIVE' } (after webhook processed)           │
   │                      │                    │                    │                    │
   │                      │── invalidateQueries([billing.subscription, auth.me])        │
   │                      │── navigate /dashboard                   │                    │
   │◀── Dashboard (PRO) ──│                    │                    │                    │
   │   (premium unlocked) │                    │                    │                    │
```

### Flow 3 — Silent Token Refresh Mid-Session

```
Browser              Axios Interceptor       Backend
   │                       │                    │
   │── API Request ─────────▶                   │
   │                       │── Add Bearer token ▶
   │                       │◀── 401 (token expired)
   │                       │                    │
   │                       │── Queue request    │
   │                       │── POST /auth/refresh ─────────▶
   │                       │   (httpOnly cookie sent auto)  │
   │                       │◀── 200 { newAccessToken } ─────│
   │                       │   Cookie: NEW refresh_token    │
   │                       │                    │
   │                       │── Update auth store with new token
   │                       │── Replay queued request with new token
   │◀── API Response ───────│                   │
```

---

## 19. Observability & Analytics

### Correlation ID Flow

```
Browser                        Backend                         Logs
  │                               │                              │
  │── X-Correlation-Id: abc-123 ─▶│                              │
  │                               │── Middleware extracts ID     │
  │                               │── Attaches to ILogger scope  │
  │                               │                              │
  │                               │── [abc-123] Auth validated   │──▶ Structured log
  │                               │── [abc-123] Usage checked    │──▶ Structured log
  │                               │── [abc-123] Handler executed │──▶ Structured log
  │                               │                              │
  │◀── X-Correlation-Id: abc-123 ─│                              │
  │    (echoed in response)        │                             │
```

### Analytics Events Specification

```typescript
// shared/services/analytics.service.ts

type AnalyticsEvent =
  | { name: 'pricing_viewed';              props: { source: string } }
  | { name: 'free_signup_started';         props: Record<string, never> }
  | { name: 'pro_checkout_started';        props: { billingCycle: string; source: string } }
  | { name: 'payment_success';             props: { plan: string; amount: number } }
  | { name: 'payment_failed';              props: { reason: string } }
  | { name: 'subscription_upgraded';       props: { fromPlan: string; toPlan: string } }
  | { name: 'subscription_canceled';       props: { plan: string } }
  | { name: 'premium_feature_clicked';     props: { feature: string; currentPlan: string } }
  | { name: 'usage_limit_reached';         props: { feature: string; limit: number } }
  | { name: 'upgrade_modal_opened';        props: { trigger: string } }
  | { name: 'upgrade_modal_dismissed';     props: Record<string, never> };

class AnalyticsService {
  track<T extends AnalyticsEvent['name']>(
    event: T,
    props?: Extract<AnalyticsEvent, { name: T }>['props']
  ): void {
    if (typeof window === 'undefined') return;
    // Send to PostHog / Mixpanel / Segment
    window.analytics?.track(event, props);
    // Also log for debugging in dev
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[Analytics] ${event}`, props);
    }
  }
}

export const analyticsService = new AnalyticsService();
```

### Structured Logging (Backend)

```csharp
// Every billing lifecycle event is logged:

_logger.LogInformation(
    "Subscription activated. UserId={UserId}, Plan={Plan}, StripeSubId={StripeSubId}, CorrelationId={CorrelationId}",
    userId, plan, stripeSubscriptionId, correlationId
);

// Errors include context:
_logger.LogError(
    ex,
    "Failed to process webhook. EventId={EventId}, EventType={EventType}, CorrelationId={CorrelationId}",
    eventId, eventType, correlationId
);
```

---

## 20. Production Deployment & Scalability

### Infrastructure Architecture

```
Internet
   │
   ▼
Cloudflare (CDN + DDoS protection + WAF)
   │
   ├── Static assets → Cloudflare R2 / CDN edge
   │
   └── Dynamic requests
         │
         ▼
    Vercel (Frontend — Next.js)
         │
         │── API calls ──▶ Railway / Fly.io (Backend — ASP.NET Core 9)
         │                    │
         │                    ├── PostgreSQL (Supabase / Neon / Railway)
         │                    ├── Redis (Upstash) — rate limiting + JWT revocation
         │                    └── Stripe API
         │
         └── Background Jobs (Hangfire or similar)
               └── Subscription expiry check (daily)
               └── Failed payment notifications (hourly)
```

### Environment Configuration

```bash
# Production environment variables

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://api.lingoura.ai/api
NEXT_PUBLIC_APP_URL=https://app.lingoura.ai
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Backend (Railway secrets)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_PRIVATE_KEY=...         # RS256 private key (PEM)
JWT_PUBLIC_KEY=...          # RS256 public key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ALLOWED_ORIGINS=https://app.lingoura.ai
```

### Scaling Considerations

| Concern | Solution |
|---|---|
| Access token validation latency | RS256 public key — no DB lookup, CPU-only |
| Subscription check per request | JWT claims cache plan+status — avoid DB on every request |
| Usage tracking race conditions | PostgreSQL atomic UPSERT — no Redis needed for counts |
| Webhook processing backlog | Async MediatR + retry queue — Stripe retries handle bursts |
| Session state across instances | Stateless JWT — any instance serves any request |
| Real-time AI streaming | WebSocket on separate `/ws` server — auth via token query param |
| Rate limiting | Redis sliding window per user+feature — shared across instances |

### Future Scalability Checklist

- [ ] **Refresh token family tracking** — detect refresh token theft via family invalidation
- [ ] **JWT revocation via Redis** — store revoked `jti` list with TTL matching token expiry
- [ ] **Organization/Team billing** — `organization_id` column in `users` table + per-seat subscriptions
- [ ] **Feature flag system** — LaunchDarkly or GrowthBook for gradual feature rollouts
- [ ] **AI streaming** — WebSocket server with subscription validation on connection
- [ ] **Metered billing** — Stripe metered subscriptions for usage-based pricing
- [ ] **Multi-region** — PostgreSQL read replicas + Cloudflare Workers for edge auth checks
- [ ] **GDPR compliance** — data export + account deletion flow (soft delete already in schema)
- [ ] **Audit logging** — every billing event logged to `billing_audit_log` (already in schema)
- [ ] **Dunning management** — automated email sequences on failed payment (Stripe Billing)

---

## Architecture Decision Summary

| Decision | Choice | Rationale |
|---|---|---|
| Token storage | Memory (Zustand) | Prevents XSS token theft |
| Refresh token transport | httpOnly cookie | Opaque to JavaScript |
| Subscription source of truth | Stripe webhooks | Redirects can fail or be faked |
| Payment processor | Stripe | Industry standard, excellent webhook reliability |
| Auth algorithm | RS256 JWT | Asymmetric — verifiers don't need the signing key |
| Usage tracking storage | PostgreSQL (atomic UPSERT) | Consistent, no Redis dependency |
| Feature gating enforcement | Backend policies | Frontend gating is UX only |
| Cross-tab sync | BroadcastChannel API | No server needed, native browser API |
| Query cache invalidation | TanStack Query | Precise, query-key-level invalidation |
| Webhook idempotency | DB event log + UPSERT | Handles Stripe retries safely |
| Subscription–Auth coupling | **Decoupled** | Dashboard access ≠ subscription access |

---

*This document is the authoritative reference for the Lingoura AI commercial system. All billing, authentication, and subscription engineering decisions must be consistent with this specification. Any deviation requires an Architecture Decision Record (ADR).*
