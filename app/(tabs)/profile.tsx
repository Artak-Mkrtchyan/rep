import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LANGUAGE_FLAGS, LanguagePickerModal } from '@/components/profile/language-picker-modal';
import { ProfileHeader } from '@/components/profile/profile-header';
import {
  ProfileMenuSection,
  ProfileMenuSectionItem,
} from '@/components/profile/profile-menu-section';
import { ProfileSocialLinks, SocialLinkItem } from '@/components/profile/profile-social-links';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLogout } from '@/hooks/api/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useThemeValue } from '@/hooks/use-theme';

const ICON_SIZE = 20;

function useProfileMenuItems(
  iconColor: string,
  onLogout: () => void,
  onLanguagePress: () => void,
  currentFlag: string,
  t: (key: string) => string
): { mainItems: ProfileMenuSectionItem[]; secondaryItems: ProfileMenuSectionItem[] } {
  const mainItems: ProfileMenuSectionItem[] = [
    {
      id: 'personal-info',
      label: t('profile.personal_info'),
      icon: <Ionicons name="person-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'change-password',
      label: t('profile.change_password'),
      icon: <Ionicons name="settings-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/profile/change-password'),
    },
    {
      id: 'notifications',
      label: t('profile.notifications'),
      icon: <Ionicons name="notifications-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'my-application',
      label: t('profile.my_application'),
      icon: <Ionicons name="document-text-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/applications'),
    },
    {
      id: 'brokers-management',
      label: t('profile.brokers_management'),
      icon: <Ionicons name="people-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'comparisons',
      label: t('profile.comparisons'),
      icon: <Ionicons name="git-compare-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/profile/comparisons' as any),
    },
  ];

  const secondaryItems: ProfileMenuSectionItem[] = [
    {
      id: 'help',
      label: t('profile.help'),
      icon: <Ionicons name="information-circle-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'languages',
      label: t('profile.languages'),
      icon: <ThemedText className="text-[18px] leading-none">{currentFlag}</ThemedText>,
      onPress: onLanguagePress,
    },
    {
      id: 'logout',
      label: t('profile.logout'),
      icon: <Ionicons name="log-out-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: onLogout,
      showChevron: false,
    },
  ];

  return { mainItems, secondaryItems };
}

const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'facebook',
    icon: 'logo-facebook',
    onPress: () => {},
    accessibilityLabel: 'Facebook',
  },
  {
    id: 'instagram',
    icon: 'logo-instagram',
    onPress: () => {},
    accessibilityLabel: 'Instagram',
  },
  {
    id: 'youtube',
    icon: 'logo-youtube',
    onPress: () => {},
    accessibilityLabel: 'YouTube',
  },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { logout, isLoading } = useLogout();
  const iconColor = useThemeValue('foreground');
  const { language, changeLanguage } = useLanguage();
  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logout_confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.logout'), style: 'destructive', onPress: logout },
    ]);
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen when available
  };

  const { mainItems, secondaryItems } = useProfileMenuItems(
    iconColor,
    handleLogout,
    () => setLanguagePickerVisible(true),
    LANGUAGE_FLAGS[language],
    t
  );

  if (isLoading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator color="#0e9457" />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-muted">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}>
          <ThemedText className="px-5 pb-6 pt-6 text-[28px] font-bold text-foreground">
            {t('profile.title')}
          </ThemedText>

          <ProfileHeader
            name="Gloria Duasa"
            email="nune.yesayan@gmail.com"
            onEditPress={handleEditProfile}
          />

          <ProfileMenuSection items={mainItems} />
          <ProfileMenuSection items={secondaryItems} />

          <ProfileSocialLinks links={SOCIAL_LINKS} />
        </ScrollView>

        <LanguagePickerModal
          visible={languagePickerVisible}
          currentLanguage={language}
          onSelect={(lang) => {
            changeLanguage(lang);
            setLanguagePickerVisible(false);
          }}
          onClose={() => setLanguagePickerVisible(false)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
