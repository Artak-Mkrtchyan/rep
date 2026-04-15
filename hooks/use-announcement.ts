import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { getCurrentStep, getTargetRoute, getTargetRouteByName } from '@/lib/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { router, usePathname } from 'expo-router';

export function useHandleNextPress() {
  const nextStep = useAnnouncementForRentFormStore((state) => state.nextStep);
  const pathname = usePathname();

  return (isBroker?: boolean) => {
    if (pathname === ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path && isBroker) {
      router.replace(ANNOUNCEMENT_ROUTES.RENT_BROKER_LIST.path);
      return;
    }

    if (pathname === ANNOUNCEMENT_ROUTES.RENT_MEDIA_FIRST.path) {
      router.replace(ANNOUNCEMENT_ROUTES.RENT_MEDIA_SECOND.path);
      return;
    }

    if (pathname === ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_FIRST.path) {
      router.replace(ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_SECOND.path);
      return;
    }

    nextStep();
  };
}

const EDITABLE_STATUSES = ['DRAFT', 'RETURNED_TO_APPLICANT'];

export function useHandleBackPress() {
  const setCurrentStep = useAnnouncementForRentFormStore((s) => s.setCurrentStep);
  const statusCode = useAnnouncementForRentFormStore(
    (s) => s.metaData?.response?.status?.code
  );

  return (step: number, routeName: string) => {
    // Read-only applications (non-editable) should exit straight to the list.
    if (statusCode && !EDITABLE_STATUSES.includes(statusCode)) {
      router.back();
      return;
    }

    if (
      routeName === ANNOUNCEMENT_ROUTES.RENT_BROKER_LIST.name ||
      routeName === ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_SECOND.name ||
      routeName === ANNOUNCEMENT_ROUTES.RENT_MEDIA_SECOND.name
    ) {
      const href = getTargetRoute(step);
      router.replace(href);
      return;
    }

    if (step === 1) {
      router.back();
      return;
    }

    setCurrentStep(--step);
  };
}

export function useStepRedirect() {
  const targetStep = useAnnouncementForRentFormStore((s) => s.formData.stepNumber);
  const listingType = useAnnouncementForRentFormStore((s) => s.formData.listingType);
  const pathname = usePathname();

  const currentStep = getCurrentStep(pathname);
  const shouldRedirect = currentStep !== undefined && currentStep !== targetStep;

  const routeName = listingType === 'FOR_RENT' ? 'rent-details' : 'sale-details';

  const targetRoute = getTargetRouteByName(targetStep, routeName);

  return {
    currentStep,
    shouldRedirect,
    targetRoute,
  };
}
