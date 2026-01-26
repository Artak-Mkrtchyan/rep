import type { AccountRole } from '@/types/auth';

export const ACCOUNT_TYPE_OPTIONS = [
  { label: 'Individual user', value: 'individual' as AccountRole },
  { label: 'Construction company', value: 'company' as AccountRole },
  { label: 'Broker', value: 'broker' as AccountRole },
];
export const AUTH_ROUTES = {
  LOGIN: '/(auth)',
  SIGNUP: '/(auth)/signup',
  SIGNUP_EMAIL: '/(auth)/signup/step-email',
  SIGNUP_VERIFY: '/(auth)/signup/verify',
  SIGNUP_BROKER: '/(auth)/signup/broker',
  SIGNUP_PASSWORD: '/(auth)/signup/create-password',
  SIGNUP_COMPLETED: '/(auth)/signup/completed',
} as const;

export const IMAGE_DIMENSIONS = {
  BROKER_ILLUSTRATION: { width: 196, height: 138 },
  EMAIL_VERIFY: { width: 102, height: 102 },
  SIGNUP_EMAIL: { width: 196, height: 138 },
  SIGNUP_SUCCESS: { width: 212, height: 135 },
  SIGNUP_ILLUSTRATION: { width: 170, height: 113 },
  SOCIAL_ICON: { width: 24, height: 24 },
  LOGIN_ILLUSTRATION: { width: 208, height: 141 },
} as const;
