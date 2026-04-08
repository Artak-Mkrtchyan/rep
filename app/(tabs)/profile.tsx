import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LANGUAGE_FLAGS, LanguagePickerModal } from '@/components/profile/language-picker-modal';
import { ProfileHeader } from '@/components/profile/profile-header';
import {
  ProfileMenuSection,
  type ProfileMenuSectionItem,
} from '@/components/profile/profile-menu-section';
import { ProfileSocialLinks } from '@/components/profile/profile-social-links';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MAIN_MENU_ITEMS, SOCIAL_LINKS } from '@/constants/profile-menu';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/api/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useThemeValue } from '@/hooks/use-theme';

const ICON_SIZE = 22;
const LOGOUT_COLOR = '#FF7070';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const { logout, isLoading } = useLogout();
  const iconColor = useThemeValue('foreground');
  const { language, changeLanguage } = useLanguage();
  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);

  const handleLogout = useCallback(() => {
    Alert.alert(t('profile.logout'), t('profile.logout_confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.logout'), style: 'destructive', onPress: logout },
    ]);
  }, [t, logout]);

  const navigateToPersonalInfo = useCallback(() => {
    router.push('/profile/personal-information' as any);
  }, []);

  const mainItems = useMemo<ProfileMenuSectionItem[]>(
    () =>
      MAIN_MENU_ITEMS.map((item) => ({
        id: item.id,
        label: t(item.labelKey),
        icon: <Ionicons name={item.icon} size={ICON_SIZE} color={iconColor} />,
        onPress: () => {
          if (item.route) router.push(item.route as any);
        },
      })),
    [t, iconColor],
  );

  const secondaryItems = useMemo<ProfileMenuSectionItem[]>(
    () => [
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
        onPress: () => setLanguagePickerVisible(true),
      },
      {
        id: 'logout',
        label: t('profile.logout'),
        icon: <Ionicons name="log-out-outline" size={ICON_SIZE} color={LOGOUT_COLOR} />,
        onPress: handleLogout,
        showChevron: false,
        isDestructive: true,
      },
    ],
    [t, iconColor, language, handleLogout],
  );

  const socialLinks = useMemo(
    () => SOCIAL_LINKS.map((link) => ({ ...link, onPress: () => {} })),
    [],
  );

  if (isLoading) {
    return (
      <ThemedView className="flex-1 items-center justify-center bg-[#F5F5F5]">
        <ActivityIndicator color="#0e9457" />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-[#F5F5F5]">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="px-4 pb-6 pt-3">
            <ThemedText className="text-[34px] font-bold leading-[41px] text-[#111111]">
              {t('profile.title')}
            </ThemedText>
          </View>

          <ProfileHeader
            name={userInfo?.fullName || ''}
            email={userInfo?.email || ''}
            onEditPress={navigateToPersonalInfo}
          />

          <ProfileMenuSection items={mainItems} />
          <ProfileMenuSection items={secondaryItems} />
          <ProfileSocialLinks links={socialLinks} />
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
