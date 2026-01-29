import { useRouter, useSegments } from 'expo-router';

import { AUTH_ROUTES } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';

const FLOW_ORDER = [
  AUTH_ROUTES.SIGNUP, // 1. Role Selection
  AUTH_ROUTES.SIGNUP_EMAIL, // 2. Email Input
  AUTH_ROUTES.SIGNUP_VERIFY, // 3. OTP Verification
  AUTH_ROUTES.SIGNUP_BROKER, // 4. Broker Details (Conditional)
  AUTH_ROUTES.SIGNUP_PASSWORD, // 5. Password Creation
  AUTH_ROUTES.SIGNUP_COMPLETED, // 6. Completion
];

export function useSignUpFlow() {
  const { data } = useSignUpContext();
  const router = useRouter();
  const segments = useSegments();

  const getCurrentRoute = () => {
    // Construct the current path from segments
    // segments is typically array like ["(auth)", "signup", "step-email"]
    // We need to match it against AUTH_ROUTES values
    const path = '/' + segments.join('/');

    // Find the matching route in FLOW_ORDER
    // Note: This simple matching assumes exact match.
    // If segments contain dynamic params, more robust matching might be needed.
    return FLOW_ORDER.find((route) => path.endsWith(route)) || AUTH_ROUTES.SIGNUP;
  };

  const goToNext = () => {
    const currentRoute = getCurrentRoute();
    const currentIndex = FLOW_ORDER.findIndex((route) => currentRoute.endsWith(route));

    if (currentIndex === -1) {
      console.warn('Current route not found in flow order:', currentRoute);
      return;
    }

    let nextIndex = currentIndex + 1;

    // Logic to skip steps
    // If next step is BROKER but role is NOT broker, skip it
    if (FLOW_ORDER[nextIndex] === AUTH_ROUTES.SIGNUP_BROKER) {
      if (data.role !== 'broker') {
        nextIndex++; // Skip to Password
      }
    }

    if (nextIndex < FLOW_ORDER.length) {
      router.push(FLOW_ORDER[nextIndex]);
    } else {
      console.warn('No next step defined');
    }
  };

  const goToPrevious = () => {
    const currentRoute = getCurrentRoute();
    const currentIndex = FLOW_ORDER.findIndex((route) => currentRoute.endsWith(route));

    if (currentIndex <= 0) {
      router.back();
      return;
    }

    let prevIndex = currentIndex - 1;

    // Logic to skip steps backwards
    if (FLOW_ORDER[prevIndex] === AUTH_ROUTES.SIGNUP_BROKER) {
      if (data.role !== 'broker') {
        prevIndex--;
      }
    }

    router.push(FLOW_ORDER[prevIndex]);
  };

  return { goToNext, goToPrevious };
}
