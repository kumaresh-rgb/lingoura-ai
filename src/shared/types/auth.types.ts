// ─── Backend DTOs — matches ASP.NET Core AuthResponseDto exactly ─────────────

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;   // ISO date string
  user: AuthUser;
}

/** Map the minimal backend UserDto to the richer frontend User shape. */
export function mapAuthUser(dto: AuthUser): User {
  return {
    id: dto.id,
    email: dto.email,
    displayName: [dto.firstName, dto.lastName].filter(Boolean).join(' '),
    avatarUrl: null,
    role: 'student',
    cefrLevel: 'B1',
    targetBand: 7.0,
    subscription: { plan: 'FREE', status: 'ACTIVE', periodEnd: null },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── Frontend User shape ──────────────────────────────────────────────────────

export type UserRole = 'student' | 'premium' | 'admin';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type SubscriptionPlan = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE';

export interface SubscriptionClaims {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  periodEnd: string | null;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  cefrLevel: CefrLevel;
  targetBand: number;
  subscription: SubscriptionClaims;
  createdAt: string;
  updatedAt: string;
}

// ─── Aliases for backward compatibility ───────────────────────────────────────
export type LoginResponse    = AuthResponse;
export type RegisterResponse = AuthResponse;
export type RefreshResponse  = AuthResponse;

export interface AuthSession {
  user: User;
  accessToken: string;
  isAuthenticated: boolean;
}
