import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProfileHeader } from '@/components/profile/profile-header';
import {
  ProfileMenuSection,
  ProfileMenuSectionItem,
} from '@/components/profile/profile-menu-section';
import { ProfileSocialLinks, SocialLinkItem } from '@/components/profile/profile-social-links';
import { useLogout } from '@/hooks/api/use-auth';
import { useThemeValue } from '@/hooks/use-theme';

const ICON_SIZE = 20;

function useProfileMenuItems(
  iconColor: string,
  onLogout: () => void
): { mainItems: ProfileMenuSectionItem[]; secondaryItems: ProfileMenuSectionItem[] } {
  const mainItems: ProfileMenuSectionItem[] = [
    {
      id: 'personal-info',
      label: 'Personal information',
      icon: <Ionicons name="person-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'change-password',
      label: 'Change password',
      icon: <Ionicons name="settings-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Ionicons name="notifications-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'my-application',
      label: 'My application',
      icon: <Ionicons name="document-text-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'brokers-management',
      label: 'Brokers management',
      icon: <Ionicons name="people-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'comparisons',
      label: 'Comparisons',
      icon: <Ionicons name="git-compare-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
  ];

  const secondaryItems: ProfileMenuSectionItem[] = [
    {
      id: 'help',
      label: 'Help',
      icon: <Ionicons name="information-circle-outline" size={ICON_SIZE} color={iconColor} />,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'languages',
      label: 'Languages',
      icon: <ThemedText className="text-[18px] leading-none">🇺🇸</ThemedText>,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'logout',
      label: 'Log out',
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
  const { logout, isLoading } = useLogout();
  const iconColor = useThemeValue('foreground');

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen when available
  };

  const { mainItems, secondaryItems } = useProfileMenuItems(iconColor, handleLogout);

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
            Profile
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
      </SafeAreaView>
    </ThemedView>
  );
}
