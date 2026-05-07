import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export interface MenuItemConfig {
  id: string;
  labelKey: string;
  icon: IoniconsName;
  route?: string;
}

export const MAIN_MENU_ITEMS: MenuItemConfig[] = [
  {
    id: 'personal-info',
    labelKey: 'profile.personal_info',
    icon: 'person-outline',
    route: '/profile/personal-information',
  },
  {
    id: 'account-security',
    labelKey: 'profile.account_and_security',
    icon: 'settings-outline',
    route: '/profile/change-password',
  },
  {
    id: 'notifications',
    labelKey: 'profile.notifications',
    icon: 'notifications-outline',
  },
  {
    id: 'my-announcements',
    labelKey: 'profile.my_announcements',
    icon: 'megaphone-outline',
    route: '/my-announcements',
  },
  {
    id: 'my-application',
    labelKey: 'profile.my_application',
    icon: 'document-text-outline',
    route: '/applications',
  },
  {
    id: 'bookings',
    labelKey: 'profile.bookings',
    icon: 'calendar-outline',
    route: '/bookings',
  },
  {
    id: 'brokers-management',
    labelKey: 'profile.brokers_management',
    icon: 'people-outline',
  },
  {
    id: 'comparisons',
    labelKey: 'profile.comparisons',
    icon: 'git-compare-outline',
    route: '/profile/comparisons',
  },
];

/** Figma `10602:124212` — Profile / individual broker main block */
export const INDIVIDUAL_BROKER_MAIN_MENU_ITEMS: MenuItemConfig[] = [
  {
    id: 'personal-info',
    labelKey: 'profile.personal_info',
    icon: 'person-outline',
    route: '/profile/personal-information',
  },
  {
    id: 'comparisons',
    labelKey: 'profile.comparisons',
    icon: 'git-compare-outline',
    route: '/profile/comparisons',
  },
  {
    id: 'bookings',
    labelKey: 'profile.bookings',
    icon: 'calendar-outline',
    route: '/bookings',
  },
  {
    id: 'announcements',
    labelKey: 'profile.my_announcements',
    icon: 'megaphone-outline',
    route: '/my-announcements',
  },
  {
    id: 'applications',
    labelKey: 'profile.applications',
    icon: 'clipboard-outline',
    route: '/applications',
  },
  {
    id: 'brokers-management',
    labelKey: 'profile.brokers_management',
    icon: 'people-outline',
  },
  {
    id: 'account-security',
    labelKey: 'profile.account_and_security',
    icon: 'shield-checkmark-outline',
    route: '/profile/change-password',
  },
  {
    id: 'notifications',
    labelKey: 'profile.notifications',
    icon: 'notifications-outline',
  },
];

export const SOCIAL_LINKS = [
  { id: 'facebook', icon: 'logo-facebook' as const, accessibilityLabel: 'Facebook', url: '' },
  { id: 'instagram', icon: 'logo-instagram' as const, accessibilityLabel: 'Instagram', url: '' },
  { id: 'youtube', icon: 'logo-youtube' as const, accessibilityLabel: 'YouTube', url: '' },
];
