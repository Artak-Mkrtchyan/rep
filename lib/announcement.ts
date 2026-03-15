import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';

export type AnnouncementRoutePath =
  (typeof ANNOUNCEMENT_ROUTES)[keyof typeof ANNOUNCEMENT_ROUTES]['path'];

const ROUTES = Object.values(ANNOUNCEMENT_ROUTES);

export const getTargetRoute = (step: number): AnnouncementRoutePath => {
  const route = ROUTES.find((r) => r.completedStep === step);
  return (route?.path ?? ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path) as AnnouncementRoutePath;
};

export const getTargetStep = (path: string): number | undefined => {
  const route = ROUTES.find((r) => r.path === path);
  return route?.completedStep;
};
