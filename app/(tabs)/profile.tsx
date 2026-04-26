import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguagePickerModal } from '@/components/profile/language-picker-modal';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileMenuSection } from '@/components/profile/profile-menu-section';
import { ProfileSocialLinks } from '@/components/profile/profile-social-links';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/api/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useThemeValue } from '@/hooks/use-theme';
import {
  buildMainProfileSectionItems,
  buildProfileSocialLinks,
  buildSecondaryProfileSectionItems,
} from '@/lib/profile/profile-screen-menu';

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
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(tabs)');
        },
      },
    ]);
  }, [t, logout]);

  const navigateToPersonalInfo = useCallback(() => {
    router.push('/profile/personal-information' as any);
  }, []);

  const openLanguagePicker = useCallback(() => setLanguagePickerVisible(true), []);

  const mainItems = useMemo(
    () => buildMainProfileSectionItems(userInfo, t, iconColor),
    [userInfo, t, iconColor]
  );

  const secondaryItems = useMemo(
    () =>
      buildSecondaryProfileSectionItems({
        t,
        iconColor,
        language,
        onOpenLanguagePicker: openLanguagePicker,
        onLogout: handleLogout,
      }),
    [t, iconColor, language, openLanguagePicker, handleLogout]
  );

  const socialLinks = useMemo(() => buildProfileSocialLinks(), []);

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
