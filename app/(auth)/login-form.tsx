import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';

import { SignInFooter } from '@/components/auth/sign-in-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { IMAGE_DIMENSIONS } from '@/constants/auth';
import { useLogin } from '@/hooks/api/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { AuthScope } from '@/lib/api/auth';
import { validateEmail } from '@/lib/auth-validation';
import type { AccountRole } from '@/types/auth';

const ROLE_TO_SCOPE: Record<string, AuthScope> = {
  individual: AuthScope.USUAL,
  company: AuthScope.CONSTRUCTION,
  broker: AuthScope.BROKER,
  broker_company: AuthScope.BROKER_COMPANY,
};

export default function LoginFormScreen() {
  const { role } = useLocalSearchParams<{ role: AccountRole }>();
  const scope = ROLE_TO_SCOPE[role ?? ''] ?? AuthScope.USUAL;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const { login, isLoading, error: loginError, reset: resetLoginError } = useLogin();
  const { tokens: theme } = useTheme();

  const canContinue = email.length > 0 && password.length > 0 && !isLoading;

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(null);
    resetLoginError();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(null);
    resetLoginError();
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(email.trim(), password, scope);
      // Navigation is handled automatically by RootNavigator in _layout.tsx
      // when auth state changes
    } catch {
      Alert.alert(
        'Login Failed',
        loginError?.message || 'Invalid email or password. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign in
    Alert.alert('Google Sign In', 'Google sign in coming soon.');
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple sign in
    Alert.alert('Apple Sign In', 'Apple sign in coming soon.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ThemedView className="flex-1 items-center justify-center px-4">
        <View className="w-[358px] max-w-full items-center gap-6">
          <Image
            style={IMAGE_DIMENSIONS.LOGIN_ILLUSTRATION}
            source={require('@/assets/images/login-illustration.svg')}
            contentFit="contain"
          />

          <ThemedText type="title" className="text-center">
            Log in
          </ThemedText>

          <Input
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            placeholderTextColor={theme.placeholder}
            error={emailError || (loginError ? ' ' : undefined)}
            editable={!isLoading}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder=""
            secureTextEntry
            showPasswordToggle
            autoComplete="password"
            placeholderTextColor={theme.placeholder}
            error={passwordError || (loginError ? loginError.message : undefined)}
            editable={!isLoading}
          />

          <Pressable
            className="h-16 justify-center self-end rounded-[6px] px-1"
            onPress={handleForgotPassword}
            disabled={isLoading}>
            <ThemedText className="text-[16px] text-primary">Forgot password?</ThemedText>
          </Pressable>

          <Pressable
            disabled={!canContinue}
            onPress={handleLogin}
            className={`h-[50px] w-full items-center justify-center rounded-[12px] ${
              canContinue ? 'bg-primary' : 'bg-input'
            }`}
            style={({ pressed }) => (pressed && canContinue ? { opacity: 0.9 } : undefined)}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText className="text-[16px] font-medium text-white">Continue</ThemedText>
            )}
          </Pressable>

          <SignInFooter
            onGooglePress={handleGoogleSignIn}
            onApplePress={handleAppleSignIn}
            onSignInPress={() => router.push('/(auth)/signup')}
            showSignInLink
            signInLabel="Don't have an account?"
            signInActionLabel="Sign up"
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
