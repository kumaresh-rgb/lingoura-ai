export const ROUTES = {
  // Public
  HOME: '/',
  CASE_STUDIES: '/case-studies',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ONBOARDING: '/onboarding',

  // Billing & Checkout
  BILLING: '/billing',
  BILLING_SUCCESS: '/billing/success',
  BILLING_CANCEL: '/billing/cancel',
  PRICING: '/pricing',

  // Protected — Dashboard
  DASHBOARD: '/dashboard',
  SPEAKING: '/speaking',
  LISTENING: '/listening',
  WRITING: '/writing',
  READING: '/reading',
  VOCABULARY: '/vocabulary',
  LESSONS: '/lessons',
  ANALYTICS: '/analytics',
  PROGRESS: '/progress',
  REVIEW: '/review',
  SETTINGS: '/settings',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const PROTECTED_ROUTES: Route[] = [
  ROUTES.DASHBOARD,
  ROUTES.SPEAKING,
  ROUTES.LISTENING,
  ROUTES.WRITING,
  ROUTES.READING,
  ROUTES.VOCABULARY,
  ROUTES.LESSONS,
  ROUTES.ANALYTICS,
  ROUTES.PROGRESS,
  ROUTES.REVIEW,
  ROUTES.SETTINGS,
];

export const AUTH_ROUTES: Route[] = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
];
