import 'react-native-reanimated';
import '../global.css';

import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Appearance } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';

Appearance.setColorScheme('light');

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={NAV_THEME.light}>
        <SafeAreaProvider>
          <RootNavigator />
          <StatusBar style="auto" />
          <PortalHost />
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      // User is signed in but on auth screen, redirect to home
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      // User is not signed in but on protected screen, redirect to login
      router.replace('/(auth)');
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return null;
  }

  return <Slot />;
}
