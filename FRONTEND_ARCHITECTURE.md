# Lingoura AI — Frontend Architecture Specification

**Version:** 2.0  
**Author:** Principal Frontend Architect  
**Date:** 2026-05-16  
**Status:** Authoritative Reference — All frontend engineering decisions flow from this document.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Target Architecture Principles](#3-target-architecture-principles)
4. [Complete Folder Structure](#4-complete-folder-structure)
5. [Feature Module Standard](#5-feature-module-standard)
6. [Environment Variable Strategy](#6-environment-variable-strategy)
7. [API Architecture](#7-api-architecture)
8. [Authentication Architecture](#8-authentication-architecture)
9. [Global State Strategy (Zustand)](#9-global-state-strategy-zustand)
10. [Validation Architecture](#10-validation-architecture)
11. [Security Architecture](#11-security-architecture)
12. [UI System & Design Language](#12-ui-system--design-language)
13. [Performance Architecture](#13-performance-architecture)
14. [Naming Conventions](#14-naming-conventions)
15. [Code Quality Standards](#15-code-quality-standards)
16. [Production Workflow](#16-production-workflow)
17. [Migration Roadmap](#17-migration-roadmap)
18. [Future-Proofing: Realtime & AI](#18-future-proofing-realtime--ai)

---

## 1. Executive Summary

Lingoura AI is an AI-powered English fluency platform with a production-grade ASP.NET Core 9 backend (Clean Architecture, CQRS, JWT, Google OAuth, PostgreSQL). The frontend must match this engineering quality.

**The gap today:** The current frontend is a functional prototype — a single `src/components/` flat folder, no auth system, no API layer, no state management, no validation, no typed contracts, and all data hardcoded inline. It is technically working but architecturally unmaintainable at scale.

**The target:** A professional, feature-driven frontend that can scale to millions of users, support real-time AI sessions, and be maintained by a team without regression risk. The UI philosophy is: **minimal, clean, premium, intelligent** — Google Gemini meets Linear.app.

**Stack additions required** (on top of the current Next.js + Tailwind + Framer Motion base):

| Package | Purpose |
|---|---|
| `shadcn/ui` | Accessible, composable UI primitives |
| `zustand` | Lightweight, scalable global state |
| `@tanstack/react-query` | Server-state caching, background refetching |
| `axios` | HTTP client with interceptor architecture |
| `zod` | Runtime schema validation |
| `react-hook-form` | Form state with validation integration |
| `@hookform/resolvers` | Bridge between RHF and Zod |
| `prettier` | Consistent code formatting |

---

## 2. Current State Analysis

### What Exists

```
src/
├── app/
│   ├── (dashboard)/          ← Route group — correct pattern
│   ├── auth/login/           ← UI only, no form logic
│   ├── auth/onboarding/
│   ├── case-studies/
│   ├── layout.tsx            ← Root layout with fonts + ThemeProvider
│   └── page.tsx              ← Landing page
├── components/               ← Flat dump: Sidebar, Header, DashboardLayout...
└── lib/
    └── utils.ts              ← cn() helper only
```

### Identified Issues

| Problem | Impact |
|---|---|
| All stats are inline hardcoded constants | Cannot connect to real API |
| No auth system, no tokens, no interceptors | Security gap — cannot ship |
| No form validation (login submits nothing) | Broken UX in production |
| No Axios, no typed API contracts | Fragile, untyped data layer |
| No Zustand or global state | Prop drilling will compound |
| Flat `components/` folder | Becomes unnavigable at 50+ components |
| All pages are `"use client"` | Kills SSR perf, inflates bundle |
| No environment variable validation | Runtime surprises in production |
| No error boundaries or loading skeletons | Poor error UX |
| No middleware for route protection | Any URL is accessible unauthenticated |

### What Is Good — Preserve These

- Route group pattern `(dashboard)` is correct — keep it
- `cn()` utility with `clsx` + `tailwind-merge` — keep it
- `next-themes` ThemeProvider approach — keep it
- Framer Motion animation patterns — keep, tune them
- Font setup (Manrope, Lexend) — keep it
- Sidebar pin-to-localStorage pattern — keep the concept
- The overall visual language (subtle, clean) — keep and elevate

---

## 3. Target Architecture Principles

### 3.1 Feature-Driven Architecture

The single most important structural decision. Code is organized around **product features**, not technical layers.

**Wrong (layer-first):**
```
src/
  components/
  hooks/
  services/
  types/
```
This creates cross-feature coupling and makes it impossible to understand the blast radius of a change.

**Right (feature-first):**
```
src/features/auth/
  components/   ← only auth UI
  hooks/        ← only auth hooks
  services/     ← only auth API calls
  types/        ← only auth types
```
A feature owns everything it needs. Deleting a feature means deleting one folder.

### 3.2 Strict Vertical Slicing

- Features import from `shared/` — **allowed**
- Features import from other features — **never allowed**
- `shared/` imports from features — **never allowed**
- `app/` imports from features and `shared/` — **allowed**

### 3.3 Server-First by Default

Every page is a Server Component unless it explicitly needs client interactivity. The `"use client"` boundary is pushed as deep as possible.

```
page.tsx (Server) → fetches data, passes to ↓
  FeatureContainer (Server) → layout, structure ↓
    InteractiveWidget (Client) ← "use client" only here
```

### 3.4 Type Safety at Every Boundary

- API responses validated with Zod at ingestion
- All Zustand stores are fully typed
- No `any` — use `unknown` and narrow it
- All environment variables typed and validated at startup

### 3.5 Security Layers

1. **Middleware** — route protection before page renders
2. **Auth store** — token state, session restoration
3. **Axios interceptors** — automatic refresh, error handling
4. **Zod validators** — API response shape enforcement
5. **Storage abstraction** — no raw `localStorage` access

---

## 4. Complete Folder Structure

```
apps/web/                              ← rename project root to this
│
├── src/
│   │
│   ├── app/                           ← Next.js App Router (routing only)
│   │   ├── (public)/                  ← public marketing routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               ← landing page
│   │   │   └── case-studies/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/                    ← unauthenticated auth routes
│   │   │   ├── layout.tsx             ← minimal auth shell layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── onboarding/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/               ← protected application routes
│   │   │   ├── layout.tsx             ← dashboard shell (sidebar + header)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── speaking/
│   │   │   │   └── page.tsx
│   │   │   ├── listening/
│   │   │   │   └── page.tsx
│   │   │   ├── writing/
│   │   │   │   └── page.tsx
│   │   │   ├── reading/
│   │   │   │   └── page.tsx
│   │   │   ├── vocabulary/
│   │   │   │   └── page.tsx
│   │   │   ├── lessons/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   ├── progress/
│   │   │   │   └── page.tsx
│   │   │   ├── review/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                       ← Next.js route handlers (BFF layer)
│   │   │   └── auth/
│   │   │       └── callback/
│   │   │           └── route.ts       ← Google OAuth callback handler
│   │   │
│   │   ├── error.tsx                  ← global error boundary
│   │   ├── not-found.tsx              ← 404 page
│   │   ├── layout.tsx                 ← root layout (fonts, providers)
│   │   └── providers.tsx              ← client providers wrapper
│   │
│   ├── features/                      ← product feature modules
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── auth.api.ts        ← login, register, refresh calls
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── GoogleOAuthButton.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   └── AuthCard.tsx       ← shared auth UI shell
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useRegister.ts
│   │   │   │   ├── useLogout.ts
│   │   │   │   └── useCurrentUser.ts
│   │   │   ├── schemas/
│   │   │   │   └── auth.schemas.ts    ← loginSchema, registerSchema
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts    ← token storage, session restore
│   │   │   ├── store/
│   │   │   │   └── auth.store.ts      ← Zustand auth slice
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── api/
│   │   │   │   └── dashboard.api.ts
│   │   │   ├── components/
│   │   │   │   ├── StatsGrid.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── CefrRadarChart.tsx
│   │   │   │   ├── ActivityChart.tsx
│   │   │   │   ├── RecentTestsTable.tsx
│   │   │   │   ├── WelcomeHeader.tsx
│   │   │   │   └── ProfileShareCard.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardStats.ts
│   │   │   └── types/
│   │   │       └── dashboard.types.ts
│   │   │
│   │   ├── speaking/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   │   ├── SpeakingSession.tsx
│   │   │   │   ├── AudioRecorder.tsx
│   │   │   │   ├── TranscriptPanel.tsx
│   │   │   │   └── FeedbackPanel.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAudioRecorder.ts
│   │   │   │   └── useSpeakingSession.ts
│   │   │   └── types/
│   │   │       └── speaking.types.ts
│   │   │
│   │   ├── listening/
│   │   ├── writing/
│   │   ├── reading/
│   │   ├── vocabulary/
│   │   ├── lessons/
│   │   ├── analytics/
│   │   └── settings/
│   │       ├── components/
│   │       │   ├── ProfileSettings.tsx
│   │       │   ├── NotificationSettings.tsx
│   │       │   ├── AppearanceSettings.tsx
│   │       │   └── SubscriptionSettings.tsx
│   │       └── hooks/
│   │           └── useSettings.ts
│   │
│   ├── shared/                        ← reusable cross-feature infrastructure
│   │   │
│   │   ├── api/                       ← HTTP client infrastructure
│   │   │   ├── axios.ts               ← configured Axios instance
│   │   │   ├── api-client.ts          ← typed request wrappers
│   │   │   ├── endpoints.ts           ← all API endpoint constants
│   │   │   ├── error-handler.ts       ← centralized API error parsing
│   │   │   └── interceptors/
│   │   │       ├── auth.interceptor.ts        ← attach Bearer token
│   │   │       ├── refresh.interceptor.ts     ← auto refresh on 401
│   │   │       └── correlation.interceptor.ts ← X-Correlation-Id header
│   │   │
│   │   ├── auth/                      ← auth primitives used app-wide
│   │   │   ├── guards/
│   │   │   │   ├── AuthGuard.tsx      ← requires authenticated user
│   │   │   │   └── GuestGuard.tsx     ← redirects logged-in users away
│   │   │   └── session/
│   │   │       └── session.service.ts ← token read/write abstraction
│   │   │
│   │   ├── components/                ← globally reusable UI components
│   │   │   ├── ui/                    ← shadcn/ui generated components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   └── scroll-area.tsx
│   │   │   ├── feedback/
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── ErrorState.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── PageSkeleton.tsx
│   │   │   ├── data-display/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   └── BandScoreBadge.tsx
│   │   │   └── typography/
│   │   │       ├── Heading.tsx
│   │   │       └── Label.tsx
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.ts              ← ROUTES.DASHBOARD, ROUTES.LOGIN etc
│   │   │   ├── query-keys.ts          ← React Query key factories
│   │   │   └── app.constants.ts       ← TOKEN_KEY, APP_NAME etc
│   │   │
│   │   ├── hooks/                     ← globally reusable hooks
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts     ← typed, SSR-safe wrapper
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── useScrollLock.ts
│   │   │   └── useBreakpoint.ts
│   │   │
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.tsx    ← sidebar + header shell
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── AuthLayout.tsx         ← minimal centered auth shell
│   │   │   └── PublicLayout.tsx       ← marketing nav + footer
│   │   │
│   │   ├── lib/
│   │   │   ├── utils.ts               ← cn(), formatDate(), etc
│   │   │   ├── format.ts              ← number, date, score formatters
│   │   │   └── logger.ts             ← structured client-side logging
│   │   │
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx      ← TanStack Query client
│   │   │   ├── ThemeProvider.tsx      ← next-themes wrapper
│   │   │   └── ToastProvider.tsx      ← global toast notifications
│   │   │
│   │   ├── schemas/                   ← shared reusable Zod schemas
│   │   │   ├── common.schemas.ts      ← emailSchema, passwordSchema, uuidSchema
│   │   │   └── pagination.schemas.ts  ← paginatedResponseSchema
│   │   │
│   │   ├── services/
│   │   │   └── storage.service.ts     ← safe localStorage/sessionStorage abstraction
│   │   │
│   │   ├── store/
│   │   │   ├── ui.store.ts            ← sidebar state, modals, loading
│   │   │   ├── preferences.store.ts   ← theme, locale, font size
│   │   │   └── session.store.ts       ← current session metadata
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css            ← CSS custom properties, base tokens
│   │   │
│   │   ├── types/
│   │   │   ├── api.types.ts           ← ApiResponse<T>, PaginatedResponse<T>
│   │   │   ├── auth.types.ts          ← User, Role, Session
│   │   │   └── common.types.ts        ← ID, Nullable<T>, etc
│   │   │
│   │   └── utils/
│   │       ├── cn.ts                  ← re-export of cn() for convenience
│   │       ├── error.utils.ts         ← error message extraction
│   │       └── object.utils.ts        ← pick, omit, deepMerge
│   │
│   ├── middleware.ts                   ← route protection (runs on Edge)
│   └── env.ts                         ← validated environment variables
│
├── public/
│   ├── logo-icon.png
│   └── og-image.png
│
├── tests/
│   ├── unit/
│   │   └── features/
│   └── e2e/
│       └── auth.spec.ts
│
├── .env.local                         ← never committed
├── .env.example                       ← committed, all vars documented
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── CLAUDE.md
└── FRONTEND_ARCHITECTURE.md
```

---

## 5. Feature Module Standard

Every feature module follows this exact internal structure. This is not optional — consistency is what makes the codebase navigable for any engineer.

```
features/[feature-name]/
├── api/            ← raw API call functions (no side effects, no state)
├── components/     ← React components scoped to this feature
├── hooks/          ← custom hooks (useQuery wrappers, mutation hooks)
├── schemas/        ← Zod schemas for this feature's data
├── services/       ← business logic that doesn't belong in hooks/api
├── store/          ← Zustand slice (only if this feature has persistent state)
├── types/          ← TypeScript types and interfaces
└── utils/          ← pure helper functions for this feature
```

### Feature Boundary Rules

1. **A feature component may not import from another feature.** Use `shared/` for cross-cutting concerns.
2. **Feature hooks may import from `shared/api/` and `shared/store/`.** They must not import from `shared/services/` of other features.
3. **Feature schemas are local first.** Common schemas (email, password, uuid) live in `shared/schemas/`.
4. **Feature stores are slices.** They are registered in a root Zustand store; they do not create standalone stores.

### Example: Auth Feature Internal Files

```typescript
// features/auth/types/auth.types.ts
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  cefrLevel: CefrLevel;
  createdAt: string;
}

export type UserRole = 'student' | 'admin' | 'premium';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
```

---

## 6. Environment Variable Strategy

### 6.1 Validated at Runtime — `src/env.ts`

This file runs at startup and throws if any required variable is missing or malformed. No silent failures in production.

```typescript
// src/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Next.js public vars (exposed to browser)
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_APP_NAME: z.string().default('Lingoura AI'),

  // Server-only vars (never exposed to browser)
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten());
  throw new Error('Environment validation failed — check your .env.local');
}

export const env = parsed.data;
```

### 6.2 `.env.example` (committed to source control)

```bash
# Public — safe to expose to browser
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_APP_NAME=Lingoura AI

# Server-only — never prefix with NEXT_PUBLIC_
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=minimum-32-character-random-secret-here
```

### 6.3 Rules

- Never hardcode URLs, IDs, or secrets anywhere in the codebase
- Never access `process.env.X` directly outside `env.ts`
- Import `env` from `@/env` wherever an env var is needed
- All secrets use server-only variables (no `NEXT_PUBLIC_` prefix)
- `NEXT_PUBLIC_*` vars are safe for the browser only — never put secrets there

---

## 7. API Architecture

### 7.1 Endpoint Registry — `shared/api/endpoints.ts`

Single source of truth for all backend API paths. No magic strings anywhere else.

```typescript
// shared/api/endpoints.ts
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    googleCallback: '/auth/google/callback',
    me: '/auth/me',
  },
  dashboard: {
    stats: '/dashboard/stats',
    activity: '/dashboard/activity',
  },
  speaking: {
    sessions: '/speaking/sessions',
    session: (id: string) => `/speaking/sessions/${id}`,
    feedback: (id: string) => `/speaking/sessions/${id}/feedback`,
  },
  listening: {
    tests: '/listening/tests',
    test: (id: string) => `/listening/tests/${id}`,
    submit: (id: string) => `/listening/tests/${id}/submit`,
  },
  writing: {
    tasks: '/writing/tasks',
    submit: (id: string) => `/writing/tasks/${id}/submit`,
  },
  vocabulary: {
    words: '/vocabulary/words',
    review: '/vocabulary/review',
  },
  analytics: {
    overview: '/analytics/overview',
    progress: '/analytics/progress',
    cefrHistory: '/analytics/cefr-history',
  },
  settings: {
    profile: '/settings/profile',
    notifications: '/settings/notifications',
  },
} as const;
```

### 7.2 Axios Instance — `shared/api/axios.ts`

```typescript
// shared/api/axios.ts
import axios from 'axios';
import { env } from '@/env';
import { attachAuthInterceptor } from './interceptors/auth.interceptor';
import { attachRefreshInterceptor } from './interceptors/refresh.interceptor';
import { attachCorrelationInterceptor } from './interceptors/correlation.interceptor';

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // send httpOnly cookies for refresh token
});

// Interceptors applied in order
attachCorrelationInterceptor(apiClient);
attachAuthInterceptor(apiClient);
attachRefreshInterceptor(apiClient);
```

### 7.3 Typed API Client — `shared/api/api-client.ts`

```typescript
// shared/api/api-client.ts
import { apiClient } from './axios';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';

export async function get<T>(url: string): Promise<T> {
  const { data } = await apiClient.get<ApiResponse<T>>(url);
  return data.data;
}

export async function post<T, B = unknown>(url: string, body: B): Promise<T> {
  const { data } = await apiClient.post<ApiResponse<T>>(url, body);
  return data.data;
}

export async function put<T, B = unknown>(url: string, body: B): Promise<T> {
  const { data } = await apiClient.put<ApiResponse<T>>(url, body);
  return data.data;
}

export async function del<T>(url: string): Promise<T> {
  const { data } = await apiClient.delete<ApiResponse<T>>(url);
  return data.data;
}

export async function getPaginated<T>(
  url: string,
  params?: Record<string, unknown>
): Promise<PaginatedResponse<T>> {
  const { data } = await apiClient.get<PaginatedResponse<T>>(url, { params });
  return data;
}
```

### 7.4 Auth Interceptor — `shared/api/interceptors/auth.interceptor.ts`

```typescript
// shared/api/interceptors/auth.interceptor.ts
import type { AxiosInstance } from 'axios';
import { storageService } from '@/shared/services/storage.service';
import { STORAGE_KEYS } from '@/shared/constants/app.constants';

export function attachAuthInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config) => {
      const token = storageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}
```

### 7.5 Refresh Interceptor — `shared/api/interceptors/refresh.interceptor.ts`

```typescript
// shared/api/interceptors/refresh.interceptor.ts
import type { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authApi } from '@/features/auth/api/auth.api';
import { storageService } from '@/shared/services/storage.service';
import { STORAGE_KEYS, ROUTES } from '@/shared/constants';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: AxiosError | null, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

export function attachRefreshInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as typeof error.config & { _retry?: boolean };

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) throw new Error('No refresh token');

        const tokens = await authApi.refresh(refreshToken);
        storageService.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        storageService.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);

        useAuthStore.getState().setTokens(tokens);
        processQueue(null, tokens.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        useAuthStore.getState().logout();
        window.location.href = ROUTES.LOGIN;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
```

### 7.6 Correlation Interceptor — `shared/api/interceptors/correlation.interceptor.ts`

```typescript
// shared/api/interceptors/correlation.interceptor.ts
import type { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';

export function attachCorrelationInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    if (config.headers) {
      config.headers['X-Correlation-Id'] = uuidv4();
      config.headers['X-Client-Version'] = process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev';
    }
    return config;
  });
}
```

### 7.7 Error Handler — `shared/api/error-handler.ts`

```typescript
// shared/api/error-handler.ts
import type { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code: string;
  status: number;
  correlationId?: string;
  errors?: Record<string, string[]>;
}

export function parseApiError(error: unknown): ApiError {
  if (isAxiosError(error) && error.response) {
    const { data, status, headers } = error.response;
    return {
      message: data?.message ?? 'An unexpected error occurred.',
      code: data?.code ?? 'UNKNOWN_ERROR',
      status,
      correlationId: headers['x-correlation-id'],
      errors: data?.errors,
    };
  }
  return {
    message: 'Network error — please check your connection.',
    code: 'NETWORK_ERROR',
    status: 0,
  };
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
}
```

### 7.8 Shared API Types — `shared/types/api.types.ts`

```typescript
// shared/types/api.types.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';
```

---

## 8. Authentication Architecture

Auth is the most security-sensitive system in the frontend. Every piece of it is deliberate.

### 8.1 Token Storage Strategy

| Token | Storage | Reason |
|---|---|---|
| Access Token | Memory (Zustand store) | Never hits disk — cleared on tab close |
| Refresh Token | `httpOnly` cookie | Set by backend; JS cannot read it |

The backend issues the refresh token as an `httpOnly`, `Secure`, `SameSite=Strict` cookie. The frontend never touches it directly — the browser sends it automatically on `/auth/refresh` calls.

The access token lives only in Zustand's in-memory store. This means:
- Zero XSS risk on the access token (no `localStorage`)
- Tab close = access token gone (user must re-authenticate or use cookie refresh)
- Refresh token is fully opaque to JavaScript

### 8.2 Auth Store — `features/auth/store/auth.store.ts`

```typescript
// features/auth/store/auth.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, AuthTokens } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  // Actions
  setUser: (user: User) => void;
  setTokens: (tokens: Pick<AuthTokens, 'accessToken'>) => void;
  logout: () => void;
  setInitializing: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: true,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setTokens: ({ accessToken }) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      setInitializing: (isInitializing) => set({ isInitializing }),
    }),
    { name: 'auth-store' }
  )
);
```

### 8.3 Session Restoration — App Initialization

On app load, before rendering anything, the app silently attempts a token refresh using the httpOnly cookie. This restores sessions across page reloads.

```typescript
// app/providers.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authApi } from '@/features/auth/api/auth.api';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setTokens, setInitializing, logout } = useAuthStore();

  useEffect(() => {
    async function restoreSession() {
      try {
        // Attempt silent refresh using httpOnly cookie
        const { user, tokens } = await authApi.refresh();
        setUser(user);
        setTokens({ accessToken: tokens.accessToken });
      } catch {
        // No valid session — user stays logged out
        logout();
      } finally {
        setInitializing(false);
      }
    }

    restoreSession();
  }, []);

  return <>{children}</>;
}
```

### 8.4 Route Protection — `src/middleware.ts`

The middleware runs on the Next.js Edge Runtime — before any page renders. It is the first line of defence.

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/shared/constants/routes';

const PROTECTED_PREFIXES = ['/dashboard', '/speaking', '/listening', '/writing',
  '/reading', '/vocabulary', '/lessons', '/analytics', '/progress', '/review', '/settings'];

const AUTH_PREFIXES = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has('lingoura_session'); // httpOnly cookie presence

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !hasSession) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|public).*)'],
};
```

### 8.5 Auth Guards — Client-Level Protection

Guards are React components that wrap page content and enforce auth state on the client.

```typescript
// shared/auth/guards/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import { PageSkeleton } from '@/shared/components/feedback/PageSkeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isInitializing]);

  if (isInitializing) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
```

### 8.6 Login Flow — `features/auth/hooks/useLogin.ts`

```typescript
// features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';
import { parseApiError } from '@/shared/api/error-handler';
import { ROUTES } from '@/shared/constants/routes';
import type { LoginInput } from '../schemas/auth.schemas';

export function useLogin() {
  const { setUser, setTokens } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: ({ user, tokens }) => {
      setUser(user);
      setTokens({ accessToken: tokens.accessToken });
      router.replace(ROUTES.DASHBOARD);
    },
    onError: (error) => {
      const apiError = parseApiError(error);
      // Caller reads `mutation.error` to display
      throw apiError;
    },
  });
}
```

### 8.7 Logout — `features/auth/hooks/useLogout.ts`

```typescript
// features/auth/hooks/useLogout.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';
import { ROUTES } from '@/shared/constants/routes';

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Always clear state, even if API call fails
      logout();
      queryClient.clear();
      router.replace(ROUTES.LOGIN);
    },
  });
}
```

---

## 9. Global State Strategy (Zustand)

### 9.1 Store Architecture

Zustand stores are organized into slices. There is **one store per concern**, not one giant global store.

| Store | Location | Purpose |
|---|---|---|
| `auth.store` | `features/auth/store/` | User identity, tokens, auth state |
| `ui.store` | `shared/store/` | Sidebar collapse, active modals, global loading |
| `preferences.store` | `shared/store/` | Theme, locale, font size — persisted |
| `session.store` | `shared/store/` | Active session metadata (current lesson, timer) |

### 9.2 UI Store — `shared/store/ui.store.ts`

```typescript
// shared/store/ui.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  sidebarCollapsed: boolean;
  sidebarPinned: boolean;
  activeModal: string | null;

  toggleSidebar: () => void;
  setSidebarPinned: (pinned: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarPinned: true,
      activeModal: null,

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarPinned: (pinned) => set({ sidebarPinned: pinned }),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
    }),
    { name: 'lingoura-ui', partialize: (s) => ({ sidebarPinned: s.sidebarPinned }) }
  )
);
```

### 9.3 Preferences Store — `shared/store/preferences.store.ts`

```typescript
// shared/store/preferences.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type Locale = 'en' | 'es' | 'fr' | 'ar' | 'zh';

interface PreferencesState {
  theme: Theme;
  locale: Locale;
  dailyGoalMinutes: number;

  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  setDailyGoal: (minutes: number) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      locale: 'en',
      dailyGoalMinutes: 30,

      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      setDailyGoal: (dailyGoalMinutes) => set({ dailyGoalMinutes }),
    }),
    { name: 'lingoura-preferences' }
  )
);
```

### 9.4 Server State — TanStack React Query

Zustand manages **client state** (UI, preferences, auth). React Query manages **server state** (API data, caches, background refetching).

```typescript
// shared/constants/query-keys.ts
export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  dashboard: {
    stats: () => ['dashboard', 'stats'] as const,
    activity: (period: string) => ['dashboard', 'activity', period] as const,
  },
  speaking: {
    sessions: () => ['speaking', 'sessions'] as const,
    session: (id: string) => ['speaking', 'sessions', id] as const,
  },
  vocabulary: {
    words: (page: number) => ['vocabulary', 'words', page] as const,
  },
} as const;
```

```typescript
// shared/providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,         // 1 minute
        gcTime: 5 * 60_000,        // 5 minutes
        retry: (failureCount, error) => {
          // Don't retry on 4xx (client errors)
          if (isClientError(error)) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 10. Validation Architecture

### 10.1 Shared Base Schemas — `shared/schemas/common.schemas.ts`

```typescript
// shared/schemas/common.schemas.ts
import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

export const displayNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .trim();

export const uuidSchema = z.string().uuid('Invalid ID format');
```

### 10.2 Auth Schemas — `features/auth/schemas/auth.schemas.ts`

```typescript
// features/auth/schemas/auth.schemas.ts
import { z } from 'zod';
import { emailSchema, passwordSchema, displayNameSchema } from '@/shared/schemas/common.schemas';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    displayName: displayNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    token: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
```

### 10.3 Form Integration — React Hook Form + Zod

```typescript
// features/auth/components/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../schemas/auth.schemas';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const login = useLogin();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = (data: LoginInput) => login.mutate(data);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div>
        <input
          type="email"
          placeholder="name@example.com"
          {...form.register('email')}
          aria-invalid={!!form.formState.errors.email}
        />
        {form.formState.errors.email && (
          <p role="alert">{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* API-level error from mutation */}
      {login.error && (
        <p role="alert" className="text-red-600">{login.error.message}</p>
      )}

      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### 10.4 API Response Validation

API responses are validated with Zod at the ingestion boundary. If the backend returns an unexpected shape, it fails loudly in dev and logs a warning in production.

```typescript
// features/auth/api/auth.api.ts
import { post, get } from '@/shared/api/api-client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { loginResponseSchema } from '../schemas/auth.schemas';
import type { LoginInput, LoginResponse } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const raw = await post(API_ENDPOINTS.auth.login, credentials);
    return loginResponseSchema.parse(raw); // Zod validates shape
  },

  refresh: async () => {
    const raw = await post(API_ENDPOINTS.auth.refresh, {});
    return loginResponseSchema.parse(raw);
  },

  logout: () => post(API_ENDPOINTS.auth.logout, {}),

  me: () => get(API_ENDPOINTS.auth.me),
};
```

---

## 11. Security Architecture

### 11.1 Threat Model

| Threat | Mitigation |
|---|---|
| XSS stealing access token | Access token in memory only (Zustand), never in DOM/storage |
| XSS stealing refresh token | httpOnly cookie — JS cannot read it |
| CSRF on refresh endpoint | `SameSite=Strict` cookie + custom `X-Requested-With` header |
| Token leakage in logs | Tokens never logged; correlation IDs used for tracing |
| Unauthorized page access | Middleware enforces auth before render; AuthGuard is secondary |
| Stale token replay | Refresh token rotation — backend invalidates used tokens |
| Sensitive env vars in bundle | Only `NEXT_PUBLIC_*` goes to browser; no exceptions |
| Open redirect after login | `redirect` param validated against known internal routes |
| Prototype pollution | Zod parsing replaces raw `JSON.parse` at API boundary |
| Clickjacking | CSP headers set in `next.config.ts` |

### 11.2 Safe Storage Service — `shared/services/storage.service.ts`

Wraps `localStorage` to:
- Handle SSR (no `window` during server render)
- Provide typed get/set
- Prevent raw access spread across the codebase

```typescript
// shared/services/storage.service.ts
function isClient() {
  return typeof window !== 'undefined';
}

export const storageService = {
  get<T>(key: string): T | null {
    if (!isClient()) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or private mode — fail silently
    }
  },

  remove(key: string): void {
    if (!isClient()) return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (!isClient()) return;
    localStorage.clear();
  },
};
```

### 11.3 Content Security Policy — `next.config.ts`

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // tighten in prod
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https:",
      "font-src 'self'",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL}`,
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  headers: async () => [
    { source: '/(.*)', headers: securityHeaders },
  ],
};

export default nextConfig;
```

### 11.4 Route Constants — No Magic Strings

```typescript
// shared/constants/routes.ts
export const ROUTES = {
  // Public
  HOME: '/',
  CASE_STUDIES: '/case-studies',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ONBOARDING: '/onboarding',

  // Protected
  DASHBOARD: '/dashboard',
  SPEAKING: '/speaking',
  LISTENING: '/listening',
  WRITING: '/writing',
  READING: '/reading',
  VOCABULARY: '/vocabulary',
  LESSONS: '/lessons',
  ANALYTICS: '/analytics',
  PROGRESS: '/progress',
  SETTINGS: '/settings',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
```

---

## 12. UI System & Design Language

### 12.1 Design Philosophy

**Lingoura AI feels like a premium AI product.** Not a traditional e-learning platform. The visual language is inspired by:

- **Google Gemini** — clean, spacious, intelligent layouts
- **Linear** — typographic hierarchy, precise spacing, no visual noise
- **Notion** — calm whites, structured content
- **Vercel** — dark mode excellence, monochrome elegance

### 12.2 Design Tokens

All visual decisions flow from CSS custom properties, not hardcoded Tailwind color names.

```css
/* shared/styles/globals.css */
:root {
  /* Surfaces */
  --surface: 250 250 252;           /* Near-white */
  --surface-elevated: 255 255 255;  /* Pure white — cards */
  --surface-sunken: 245 246 248;    /* Inputs, code blocks */

  /* Content */
  --on-surface: 15 17 22;           /* Primary text */
  --on-surface-variant: 107 114 128; /* Secondary text */
  --on-surface-disabled: 156 163 175;

  /* Brand */
  --primary: 99 102 241;            /* Indigo-500 */
  --primary-hover: 79 70 229;       /* Indigo-600 */
  --primary-subtle: 238 242 255;    /* Indigo-50 */

  /* Feedback */
  --success: 16 185 129;
  --warning: 245 158 11;
  --error: 239 68 68;
  --info: 59 130 246;

  /* Structure */
  --outline: 226 232 240;
  --outline-variant: 241 245 249;
  --radius: 0.75rem;                /* 12px base radius */
}

.dark {
  --surface: 10 11 15;
  --surface-elevated: 17 19 24;
  --surface-sunken: 7 8 12;
  --on-surface: 248 250 252;
  --on-surface-variant: 148 163 184;
  --primary-subtle: 30 27 75;
  --outline: 30 32 40;
  --outline-variant: 22 24 30;
}
```

### 12.3 Typography Scale

| Role | Font | Weight | Size |
|---|---|---|---|
| Display (hero) | Manrope | 900 | 4rem–6rem |
| Heading 1 | Manrope | 800 | 2.25rem |
| Heading 2 | Manrope | 700 | 1.5rem |
| Heading 3 | Manrope | 600 | 1.25rem |
| Body | Manrope | 400–500 | 1rem |
| Label | Manrope | 700 | 0.625rem (uppercase, tracked) |
| Code | Lexend | 400 | 0.875rem |
| Accent (CEFR) | Libre Baskerville | 400 | contextual |

### 12.4 Spacing System

Follow an 8pt base grid. All padding/margin/gap values are multiples of 4 or 8.

```
4px  → gap-1    — tight inline spacing
8px  → gap-2    — between related elements
12px → gap-3    — within card sections
16px → gap-4    — standard component padding
24px → gap-6    — between card rows
32px → gap-8    — between major sections
48px → gap-12   — page section spacing
64px → gap-16   — hero / large section gap
```

### 12.5 Component Anatomy

**Card:**
```tsx
<div className="bg-surface-elevated border border-outline-variant rounded-2xl p-6 shadow-sm">
  {/* never add drop-shadow-xl or decorative gradients to cards */}
</div>
```

**Button — Primary:**
```tsx
<button className="px-6 py-3 bg-primary text-white font-semibold text-sm rounded-xl
  hover:bg-primary-hover transition-colors duration-150 active:scale-[0.97]
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
  disabled:opacity-50 disabled:cursor-not-allowed">
```

**Input:**
```tsx
<input className="w-full px-4 py-3 bg-surface-sunken border border-outline
  rounded-xl text-on-surface placeholder:text-on-surface-disabled
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
  transition-all duration-150" />
```

### 12.6 Animation Rules

Framer Motion is used for **meaningful transitions only**. Not decoration.

| Usage | Allowed |
|---|---|
| Page enter | Yes — `opacity: 0→1, y: 16→0`, 200ms |
| Sidebar collapse | Yes — width spring, 500ms |
| Modal open | Yes — scale + fade, 180ms |
| Card stagger | Yes — max 5 items, 60ms per step |
| Button hover | No — use CSS `transition` instead |
| Scrolling text | No |
| Background particles | No |
| Persistent looping animations | No |

```typescript
// shared/lib/motion.ts — reusable animation variants
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export const slideIn = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};
```

---

## 13. Performance Architecture

### 13.1 Server vs Client Component Strategy

```
DEFAULT: Server Component
EXCEPTION: use "use client" only when you need:
  - useState / useReducer
  - useEffect / lifecycle
  - browser APIs (window, localStorage)
  - event handlers (onClick etc)
  - Framer Motion / Zustand / React Query hooks
```

**Target bundle composition for the dashboard route:**
- Server-rendered shell (sidebar, header, stats structure)
- Client hydration islands only for interactive widgets
- Goal: < 150KB First Load JS for the dashboard

### 13.2 Lazy Loading Strategy

```typescript
// Lazy-load heavy feature pages
const SpeakingSession = lazy(() =>
  import('@/features/speaking/components/SpeakingSession')
);

// Lazy-load chart libraries
const ActivityChart = lazy(() =>
  import('@/features/dashboard/components/ActivityChart')
);
```

### 13.3 Image Optimization

All images go through `next/image`:

```tsx
import Image from 'next/image';

<Image
  src="/logo-icon.png"
  alt="Lingoura AI"
  width={80}
  height={80}
  priority // only for above-the-fold
/>
```

Never use raw `<img>` tags.

### 13.4 React Query Caching Policy

| Data Type | `staleTime` | `gcTime` | Notes |
|---|---|---|---|
| Dashboard stats | 60s | 5m | Can tolerate slight staleness |
| User profile | 5m | 30m | Rarely changes |
| Vocabulary words | 30s | 5m | Refreshed on navigation |
| Speaking sessions | 0s | 1m | Always fresh |
| CEFR history | 10m | 1h | Computed server-side, expensive |

### 13.5 Font Loading

Fonts are already loaded via `next/font/google` — this is correct. The key is `display: swap` is default, which prevents invisible text during load.

```typescript
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',       // explicit — never 'block'
  preload: true,
  variable: '--font-manrope',
});
```

---

## 14. Naming Conventions

### 14.1 Files and Folders

| Entity | Convention | Example |
|---|---|---|
| React component file | PascalCase | `LoginForm.tsx` |
| Hook file | camelCase, `use` prefix | `useLogin.ts` |
| Service file | camelCase, `.service` | `auth.service.ts` |
| API file | camelCase, `.api` | `auth.api.ts` |
| Store file | camelCase, `.store` | `auth.store.ts` |
| Schema file | camelCase, `.schemas` | `auth.schemas.ts` |
| Type file | camelCase, `.types` | `auth.types.ts` |
| Utility file | camelCase, `.utils` | `error.utils.ts` |
| Constants file | camelCase, `.constants` | `app.constants.ts` |
| Test file | Same as source + `.test` | `LoginForm.test.tsx` |

### 14.2 Variables and Types

| Entity | Convention | Example |
|---|---|---|
| React component | PascalCase | `LoginForm`, `AuthCard` |
| Custom hook | camelCase, `use` prefix | `useLogin`, `useDashboardStats` |
| Type / Interface | PascalCase | `User`, `LoginInput`, `ApiResponse` |
| Enum | PascalCase + UPPER values | `UserRole.STUDENT` |
| Zustand store | camelCase + `use` prefix | `useAuthStore`, `useUiStore` |
| Constants object | SCREAMING_SNAKE (values) | `ROUTES.LOGIN`, `STORAGE_KEYS.ACCESS_TOKEN` |
| Zod schema | camelCase + `Schema` suffix | `loginSchema`, `emailSchema` |
| React Query key factory | camelCase | `queryKeys.auth.me()` |
| Event handler | `handle` prefix | `handleSubmit`, `handleChange` |
| Boolean state | `is`/`has`/`can` prefix | `isLoading`, `hasError`, `canSubmit` |

### 14.3 Import Order (enforced by ESLint)

```typescript
// 1. React (always first)
import { useState, useEffect } from 'react';

// 2. Next.js
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 3. Third-party libraries
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

// 4. Internal — shared infrastructure
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/constants/routes';

// 5. Internal — feature-local
import { loginSchema } from '../schemas/auth.schemas';
import type { LoginInput } from '../types/auth.types';

// 6. Relative imports
import './LoginForm.css';
```

---

## 15. Code Quality Standards

### 15.1 TypeScript Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Prohibited patterns:**
```typescript
// NEVER
const data: any = response;
const user = response as User; // unsafe cast
// @ts-ignore
// @ts-expect-error (except in tests)

// INSTEAD
const data: unknown = response;
const user = userSchema.parse(response); // Zod validates and types
```

### 15.2 ESLint Configuration

```jsonc
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/strict-type-checked"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "import/no-cycle": "error",
    "import/order": ["error", { "groups": [...] }]
  }
}
```

### 15.3 Prettier Configuration

```jsonc
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

The `prettier-plugin-tailwindcss` plugin sorts Tailwind classes in canonical order automatically.

### 15.4 Component Rules

1. **One component per file.** No exceptions.
2. **Max 150 lines.** If longer, extract a subcomponent.
3. **No business logic in JSX.** Extract to hooks.
4. **No direct API calls in components.** All fetching goes through hooks.
5. **No hardcoded strings for UI text.** Use constants or i18n keys.
6. **No inline styles.** Tailwind classes only.
7. **Explicit return types on all exported functions.**

```typescript
// Good
export function LoginForm(): JSX.Element { ... }
export function useLogin(): UseMutationResult<...> { ... }

// Bad
export function LoginForm() { ... }
export const useLogin = () => { ... }
```

---

## 16. Production Workflow

### 16.1 Git Branch Strategy

```
main                    ← production, always deployable
├── develop             ← integration branch
│   ├── feat/auth-jwt   ← feature branches
│   ├── feat/speaking   ← one branch per feature
│   └── fix/sidebar     ← bug fix branches
```

Branch naming: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`

### 16.2 Pre-commit Hooks (via Husky + lint-staged)

```jsonc
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md}": ["prettier --write"]
  }
}
```

Every commit is auto-linted and formatted. No manual formatting debates.

### 16.3 CI Pipeline Requirements

```yaml
# Minimum CI pipeline steps
- name: Type Check
  run: npx tsc --noEmit

- name: Lint
  run: npm run lint

- name: Format Check
  run: npx prettier --check .

- name: Build
  run: npm run build

- name: Bundle Analysis (on PRs)
  run: npx @next/bundle-analyzer
```

### 16.4 Environment Strategy

| Environment | URL | API Target | Notes |
|---|---|---|---|
| Local | `localhost:3000` | `localhost:5000` | `.env.local` |
| Preview | Vercel preview URL | Staging API | Auto-deployed on PR |
| Staging | `staging.lingoura.ai` | Staging API | Manual promotion |
| Production | `app.lingoura.ai` | Prod API | Main branch only |

---

## 17. Migration Roadmap

Migration from current state to target architecture is done in phases to avoid breaking the running app.

### Phase 1 — Infrastructure (Week 1)

- [ ] Install required packages: `zustand`, `@tanstack/react-query`, `axios`, `zod`, `react-hook-form`, `@hookform/resolvers`
- [ ] Install and configure `shadcn/ui`
- [ ] Create `src/env.ts` with Zod validation
- [ ] Create `src/shared/api/` infrastructure (axios instance, interceptors, error handler)
- [ ] Create `src/shared/constants/` (routes, query-keys, app.constants)
- [ ] Create `src/shared/services/storage.service.ts`
- [ ] Create `src/shared/types/api.types.ts`
- [ ] Configure ESLint strict rules and Prettier
- [ ] Set up `next.config.ts` security headers

### Phase 2 — Auth System (Week 2)

- [ ] Create `features/auth/` module (types, schemas, api, store, hooks, components)
- [ ] Implement `useAuthStore` with Zustand
- [ ] Implement `shared/api/interceptors/` (auth + refresh + correlation)
- [ ] Implement `src/middleware.ts` for route protection
- [ ] Create `shared/auth/guards/` (AuthGuard, GuestGuard)
- [ ] Refactor LoginPage to use React Hook Form + Zod + `useLogin` hook
- [ ] Create RegisterPage with same pattern
- [ ] Implement session restoration in `app/providers.tsx`
- [ ] Implement Google OAuth button and callback route

### Phase 3 — Folder Restructure (Week 3)

- [ ] Move `src/components/DashboardLayout.tsx` → `src/shared/layouts/DashboardLayout.tsx`
- [ ] Move `src/components/Sidebar.tsx` → `src/shared/layouts/Sidebar.tsx`
- [ ] Move `src/components/Header.tsx` → `src/shared/layouts/Header.tsx`
- [ ] Move `src/components/ThemeProvider.tsx` → `src/shared/providers/ThemeProvider.tsx`
- [ ] Move `src/components/MeshBackground.tsx` → `src/shared/components/MeshBackground.tsx`
- [ ] Move `src/components/ProfileShareCard.tsx` → `src/features/dashboard/components/ProfileShareCard.tsx`
- [ ] Create `app/(public)/` route group for landing + case studies
- [ ] Create `app/(auth)/` route group for auth pages
- [ ] Update all imports

### Phase 4 — Feature Modules (Week 4)

- [ ] Create `features/dashboard/` module — extract hardcoded stats to API hooks
- [ ] Create `features/speaking/` module skeleton
- [ ] Create `features/listening/`, `features/writing/`, `features/reading/` skeletons
- [ ] Create `features/vocabulary/` and `features/analytics/` skeletons
- [ ] Create `features/settings/` module
- [ ] Set up React Query providers and key factories
- [ ] Connect dashboard to real API (replace hardcoded constants)

### Phase 5 — Polish & Performance (Week 5)

- [ ] Add error boundaries at route and feature level
- [ ] Add loading skeletons for all data-fetching pages
- [ ] Implement `not-found.tsx` and `error.tsx` globally
- [ ] Push `"use client"` boundaries as deep as possible
- [ ] Lazy-load heavy components
- [ ] Run bundle analysis and optimize
- [ ] Add `next/image` to all image tags
- [ ] Complete `NEXT_PUBLIC_*` audit — no secrets in browser bundle

---

## 18. Future-Proofing: Realtime & AI

The architecture is designed to absorb these capabilities without rewrites.

### 18.1 WebSocket / Streaming (Speaking AI Sessions)

```typescript
// features/speaking/hooks/useSpeakingSession.ts
// When websockets are needed:
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useSpeakingSession(sessionId: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    // WS auth via query param (can't set headers in browser WS)
    wsRef.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/speaking/${sessionId}?token=${accessToken}`
    );

    return () => wsRef.current?.close();
  }, [sessionId]);
}
```

The store and hook pattern already accommodates this. The auth store provides the token. The feature hook owns the session.

### 18.2 AI Streaming Responses

```typescript
// features/writing/api/writing.api.ts
export async function streamFeedback(taskId: string): Promise<ReadableStream> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/writing/${taskId}/feedback`, {
    headers: { Authorization: `Bearer ${useAuthStore.getState().accessToken}` },
  });
  return response.body!;
}
```

### 18.3 Role-Based Access Control

The auth store already carries `user.role`. Feature pages check it:

```typescript
// shared/auth/guards/RoleGuard.tsx
export function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const user = useAuthStore((s) => s.user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <UnauthorizedState />;
  }
  return <>{children}</>;
}
```

### 18.4 Premium Subscription Gates

```typescript
// shared/auth/guards/PremiumGuard.tsx
export function PremiumGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['premium', 'admin']}>{children}</RoleGuard>;
}
```

### 18.5 Analytics / Observability

The correlation interceptor already stamps every request with a `X-Correlation-Id`. This links frontend actions to backend traces in tools like Sentry, Datadog, or Seq.

```typescript
// shared/lib/logger.ts
export const logger = {
  info: (msg: string, ctx?: object) => {
    if (process.env.NODE_ENV !== 'production') console.log(`[INFO] ${msg}`, ctx);
    // In production: send to Sentry/Datadog
  },
  error: (msg: string, err?: unknown) => {
    console.error(`[ERROR] ${msg}`, err);
    // Always capture errors, even in production
  },
};
```

---

## Summary Reference Card

| Concern | Solution | Location |
|---|---|---|
| Routing | Next.js App Router | `src/app/` |
| Route protection | Edge Middleware + AuthGuard | `src/middleware.ts`, `shared/auth/guards/` |
| HTTP client | Axios + interceptors | `shared/api/` |
| Auth state | Zustand `useAuthStore` | `features/auth/store/` |
| UI state | Zustand `useUiStore` | `shared/store/` |
| Server state | TanStack React Query | `features/*/hooks/` |
| Form validation | React Hook Form + Zod | `features/*/schemas/`, `features/*/components/` |
| API types | Zod schemas | `features/*/schemas/`, `shared/schemas/` |
| Token storage | Memory (access) + httpOnly cookie (refresh) | `features/auth/store/` |
| Environment vars | `src/env.ts` (Zod-validated) | `src/env.ts` |
| Storage abstraction | `storageService` | `shared/services/storage.service.ts` |
| Error handling | `parseApiError` + Error Boundary | `shared/api/error-handler.ts` |
| Design tokens | CSS custom properties | `shared/styles/globals.css` |
| UI primitives | shadcn/ui | `shared/components/ui/` |
| Animations | Framer Motion (minimal) | `shared/lib/motion.ts` |
| Constants | Typed constant objects | `shared/constants/` |
| Logging | Structured logger | `shared/lib/logger.ts` |

---

*This document is the authoritative source for all frontend architecture decisions on Lingoura AI. Any deviation must be discussed and recorded as an ADR (Architecture Decision Record) in this file.*
