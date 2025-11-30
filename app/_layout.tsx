import 'react-native-reanimated'
import '../global.css'

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { AuthProvider, useAuth } from '@/context/AuthContext'
import { NAV_THEME } from '@/lib/theme'
import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={NAV_THEME.light}>
        <RootNavigator />
        <StatusBar style="auto" />
        <PortalHost />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppStack() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

function AuthStack() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return user ? <AppStack /> : <AuthStack />;
}
