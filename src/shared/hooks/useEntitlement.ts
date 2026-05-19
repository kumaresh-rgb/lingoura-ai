'use client';

/**
 * useEntitlement — server-validated feature gate hook.
 *
 * Security architecture:
 *
 *  FRONTEND (this hook):
 *   • Reads usage data that was fetched from the authenticated backend.
 *   • Provides an optimistic gate for UX purposes only (prevents wasted clicks).
 *   • NEVER makes an entitlement decision autonomously — all limits come from
 *     the server response, not from local constants.
 *
 *  BACKEND (ASP.NET — the REAL enforcer):
 *   • Every AI/feature endpoint calls EntitlementService.ConsumeAsync()
 *     which does an atomic Redis increment + DB check before processing.
 *   • If the frontend gate is bypassed (e.g. by a hacker editing JS), the
 *     backend returns 402 Payment Required or 429 Too Many Requests.
 *   • Frontend never trusts localStorage or local plan state for access decisions.
 *
 * Usage:
 *   const { canUse, remaining, limit, isLoading } = useEntitlement('speaking_sessions');
 *   if (!canUse) return <UpgradePrompt />;
 */

import { useMemo } from 'react';
import { useSubscriptionStore } from '@/features/billing/store/subscription.store';
import type { UsageFeature } from '@/features/billing/types/billing.types';

export interface EntitlementResult {
  /** UX gate — optimistic. Backend is the real enforcer. */
  canUse: boolean;
  /** How many units remain (from server response). null = unlimited. */
  remaining: number | null;
  /** The plan limit for this feature (from server response). null = unlimited. */
  limit: number | null;
  /** Units used so far in this billing period. */
  used: number;
  /** Percentage of quota consumed (0-100). 0 if unlimited. */
  pct: number;
  /** Whether the usage data has loaded from the server. */
  isLoaded: boolean;
  /** ISO timestamp when the quota resets. */
  resetAt: string | null;
}

export function useEntitlement(feature: UsageFeature): EntitlementResult {
  const usage = useSubscriptionStore((s) => s.usage);
  const isActive = useSubscriptionStore((s) => s.isActive);
  const isLoaded = useSubscriptionStore((s) => s.isLoaded);

  return useMemo<EntitlementResult>(() => {
    // If not active (canceled, past_due), block everything optimistically
    if (isLoaded && !isActive()) {
      return { canUse: false, remaining: 0, limit: 0, used: 0, pct: 100, isLoaded, resetAt: null };
    }

    const record = usage?.find((r) => r.feature === feature);

    if (!record) {
      // Data not yet loaded or feature not tracked — optimistically allow,
      // backend will enforce
      return { canUse: true, remaining: null, limit: null, used: 0, pct: 0, isLoaded, resetAt: null };
    }

    const { used, limit, resetAt } = record;
    const isUnlimited = limit === -1 || limit === 0;

    if (isUnlimited) {
      return { canUse: true, remaining: null, limit: null, used, pct: 0, isLoaded, resetAt };
    }

    const remaining = Math.max(0, limit - used);
    const pct = Math.min(100, Math.round((used / limit) * 100));

    return {
      canUse: remaining > 0,
      remaining,
      limit,
      used,
      pct,
      isLoaded,
      resetAt,
    };
  }, [usage, feature, isActive, isLoaded]);
}

/**
 * Returns true if the user has the given plan (or higher).
 * UX hint only — backend is the real enforcer.
 */
export function usePlanAccess(requiredPlan: 'PRO' | 'ELITE' | 'ENTERPRISE'): boolean {
  return useSubscriptionStore((s) => s.canAccess(requiredPlan));
}
