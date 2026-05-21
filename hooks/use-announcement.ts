import { useEffect, useRef } from 'react';

import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { getCurrentStep, getTargetRoute, getTargetRouteByName } from '@/lib/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { router, useNavigation, usePathname } from 'expo-router';

/**
 * Exit the entire announcement form flow, regardless of how many steps
 * the user pushed into the stack. Intended for "Save & exit" buttons.
 * Falls back to popping the form stack to its root + router.back() so we
 * leave the form and return to whichever screen opened it.
 */
export function useExitAnnouncementFlow() {
  const navigation = useNavigation();
  return () => {
    // Pop this stack to its root entry first (collapses all pushed steps).
    const nav = navigation as unknown as { popToTop?: () => void };
    nav.popToTop?.();
    // Then leave the form stack itself via the parent navigator.
    const parent = navigation.getParent?.();
    if (parent?.canGoBack()) {
      parent.goBack();
    } else {
      router.back();
    }
  };
}

export function useHandleNextPress() {
  const nextStep = useAnnouncementForRentFormStore((state) => state.nextStep);
  const pathname = usePathname();

  return (isBroker?: boolean) => {
    if (pathname === ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path && isBroker) {
      router.push(ANNOUNCEMENT_ROUTES.RENT_BROKER_LIST.path);
      return;
    }

    if (pathname === ANNOUNCEMENT_ROUTES.RENT_MEDIA_FIRST.path) {
      router.push(ANNOUNCEMENT_ROUTES.RENT_MEDIA_SECOND.path);
      return;
    }

    if (pathname === ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_FIRST.path) {
      router.push(ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_SECOND.path);
      return;
    }

    const newStep = nextStep();
    router.push(getTargetRoute(newStep));
  };
}

const EDITABLE_STATUSES = ['DRAFT', 'RETURNED_TO_APPLICANT'];

// Routes that share a step number with a sibling (sub-screens of the same step).
// Going back from these should NOT decrement the store step — the previous
// sibling screen still belongs to the same logical step.
const SUB_STEP_ROUTES = new Set<string>([
  ANNOUNCEMENT_ROUTES.RENT_BROKER_LIST.name,
  ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_SECOND.name,
  ANNOUNCEMENT_ROUTES.RENT_MEDIA_SECOND.name,
]);

export function useHandleBackPress() {
  const setCurrentStep = useAnnouncementForRentFormStore((s) => s.setCurrentStep);
  const statusCode = useAnnouncementForRentFormStore((s) => s.metaData?.response?.status?.code);

  return (step: number, routeName: string) => {
    // Read-only applications (non-editable) should exit straight to the list.
    if (statusCode && !EDITABLE_STATUSES.includes(statusCode)) {
      router.back();
      return;
    }

    if (!SUB_STEP_ROUTES.has(routeName) && step > 1) {
      setCurrentStep(step - 1);
    }
    router.back();
  };
}

/**
 * On initial mount only, if the persisted step doesn't match the entry pathname
 * (deep-link / refresh / restore), redirect once to the correct screen.
 * In-flow navigation is handled imperatively by useHandleNextPress / useHandleBackPress,
 * so this hook must NOT redirect again — that would replay a forward animation
 * on a back press and re-stack screens.
 */
export function useStepRedirect() {
  const targetStep = useAnnouncementForRentFormStore((s) => s.formData.stepNumber);
  const listingType = useAnnouncementForRentFormStore((s) => s.formData.listingType);
  const pathname = usePathname();

  const currentStep = getCurrentStep(pathname);
  const routeName = listingType === 'FOR_RENT' ? 'rent-details' : 'sale-details';
  const targetRoute = getTargetRouteByName(targetStep, routeName);

  const didInitialRedirectRef = useRef(false);
  useEffect(() => {
    if (didInitialRedirectRef.current) return;
    didInitialRedirectRef.current = true;
    if (currentStep !== undefined && currentStep !== targetStep) {
      router.replace(targetRoute);
    }
    // intentionally omit deps — runs once per layout mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { currentStep, shouldRedirect: false, targetRoute };
}
