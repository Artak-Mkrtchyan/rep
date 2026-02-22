import { getTargetRoute, getTargetStep } from '@/lib/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { usePathname } from 'expo-router';

export function useStepRedirect() {
  const pathname = usePathname();
  const targetStep = useAnnouncementForRentFormStore((s) => s.formData.stepNumber);

  const currentStep = getTargetStep(pathname);

  if (currentStep !== targetStep) {
    const targetRoute = getTargetRoute(targetStep);
    return { shouldRedirect: true, targetRoute, currentStep };
  }

  return { shouldRedirect: false, currentStep };
}
