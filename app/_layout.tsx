import 'react-native-reanimated';
import '../global.css';
import i18n from '../lib/i18n/i18n';

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Appearance, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { InitialLoadingScreen } from '@/components/initial-loading-screen';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { loadSavedLanguage } from '@/hooks/use-language';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';

Appearance.setColorScheme('light');

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    're-icons': require('@/assets/fonts/re-icons.ttf'),
  });

  React.useEffect(() => {
    void SplashScreen.preventAutoHideAsync();
  }, []);

  React.useEffect(() => {
    loadSavedLanguage().then((lang) => {
      if (lang) i18n.changeLanguage(lang);
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider value={NAV_THEME.light}>
          <SafeAreaProvider>
            <RootNavigator />
            <StatusBar style="auto" />
            <PortalHost />
          </SafeAreaProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    const currentSegment = segments[0] as string | undefined;
    const inAuthGroup = currentSegment === '(auth)';

    // Protected segments that require authentication
    const PROTECTED_SEGMENTS = ['menu', 'profile'];
    const inProtectedGroup = currentSegment
      ? PROTECTED_SEGMENTS.includes(currentSegment)
      : false;

    if (user && inAuthGroup) {
      // User is signed in but on auth screen, redirect to home
      router.replace('/(tabs)');
    } else if (!user && inProtectedGroup) {
      // User is not signed in but on a protected screen, redirect to auth
      router.replace('/(auth)');
    }
  }, [user, isLoading, segments, router]);

  React.useEffect(() => {
    if (isLoading) return;
    void SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <InitialLoadingScreen />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="login-required" />
    </Stack>
  );
}
