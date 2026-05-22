import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { TFunction } from 'i18next';
import React from 'react';

import { LANGUAGE_FLAGS } from '@/components/profile/language-picker-modal';
import type { ProfileMenuSectionItem } from '@/components/profile/profile-menu-section';
import { ThemedText } from '@/components/themed-text';
import {
  INDIVIDUAL_BROKER_MAIN_MENU_ITEMS,
  MAIN_MENU_ITEMS,
  SOCIAL_LINKS,
} from '@/constants/profile-menu';
import type { UserInfo } from '@/context/AuthContext';
import { AuthScope } from '@/lib/api/auth';
import type { Language } from '@/lib/i18n/i18n';

const ICON_SIZE = 22;
const LOGOUT_COLOR = '#FF7070';

export function buildMainProfileSectionItems(
  userInfo: UserInfo | null,
  t: TFunction,
  iconColor: string,
): ProfileMenuSectionItem[] {
  const config =
    userInfo?.scope === AuthScope.BROKER ? INDIVIDUAL_BROKER_MAIN_MENU_ITEMS : MAIN_MENU_ITEMS;
  
  const isBrokerCompanyManager = userInfo?.roles?.includes('broker-company-manager');
  const filteredConfig = config.filter((item) => {
    if (item.id === 'brokers-management') {
      return isBrokerCompanyManager;
    }
    return true;
  });

  return filteredConfig.map((item) => ({
    id: item.id,
    label: t(item.labelKey),
    icon: <Ionicons name={item.icon} size={ICON_SIZE} color={iconColor} />,
    onPress: () => {
      if (item.route) router.push(item.route as any);
    },
  }));
}

type SecondaryParams = {
  t: TFunction;
  iconColor: string;
  language: Language;
  onOpenLanguagePicker: () => void;
  onLogout: () => void;
};

export function buildSecondaryProfileSectionItems({
  t,
  iconColor,
  language,
  onOpenLanguagePicker,
  onLogout,
}: SecondaryParams): ProfileMenuSectionItem[] {
  return [
    {
      id: 'help',
      label: t('profile.help'),
      icon: <Ionicons name="information-circle-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => {},
    },
    {
      id: 'languages',
      label: t('profile.languages'),
      icon: <ThemedText className="text-base leading-none">{LANGUAGE_FLAGS[language]}</ThemedText>,
      onPress: onOpenLanguagePicker,
    },
    {
      id: 'logout',
      label: t('profile.logout'),
      icon: <Ionicons name="log-out-outline" size={ICON_SIZE} color={LOGOUT_COLOR} />,
      onPress: onLogout,
      showChevron: false,
      isDestructive: true,
    },
  ];
}

export function buildProfileSocialLinks() {
  return SOCIAL_LINKS.map((link) => ({ ...link, onPress: () => {} }));
}
