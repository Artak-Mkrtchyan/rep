import { Stack } from 'expo-router';

import { SignUpProvider } from '@/context/SignUpContext';

export default function AuthLayout() {
  return (
    <SignUpProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SignUpProvider>
  );
}
