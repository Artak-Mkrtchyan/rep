import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { HapticTab } from '@/components/haptic-tab';
import { useAuth } from '@/context/AuthContext';
import { THEME } from '@/lib/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TabBarIcon = ({ name, color }: { name: IconName; color: string }) => {
  return <Ionicons name={name} size={24} color={color} />;
};

export default function TabLayout() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const requireAuth = useCallback(
    (e: { preventDefault: () => void }) => {
      if (!user) {
        e.preventDefault();
        router.push('/(auth)');
      }
    },
    [user]
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.light.primary,
        tabBarInactiveTintColor: THEME.light.placeholder,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: THEME.light.background,
          borderTopColor: THEME.light.border,
          borderTopWidth: 1,
          paddingTop: 7,
          paddingBottom: 34, // Home indicator area
          height: 81, // 40px content + 7px padding + 34px home indicator
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          gap: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: t('tabs.favourite'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              router.push('/login-required/favourite');
            }
          },
        }}
      />
      <Tabs.Screen
        name="announcement"
        options={{
          title: t('tabs.announcement'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // The Announcement tab is an "action" tab — it never shows its own
            // screen. Signed-in users jump straight to the create-listing flow;
            // guests get the login-required page. Prevent default so the
            // current tab stays focused when they return.
            e.preventDefault();
            if (!user) {
              router.push('/login-required/announcement');
            } else {
              router.push('/announcement/form/new');
            }
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
        listeners={{ tabPress: requireAuth }}
      />
    </Tabs>
  );
}
