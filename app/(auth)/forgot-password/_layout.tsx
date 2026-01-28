import { Stack } from 'expo-router';
import React from 'react';

import { ForgotPasswordProvider } from '@/context/ForgotPasswordContext';

export default function ForgotPasswordLayout() {
  return (
    <ForgotPasswordProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="reset" />
      </Stack>
    </ForgotPasswordProvider>
  );
}
