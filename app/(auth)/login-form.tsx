import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      setEmailError(t('validation.email_required'));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t('validation.email_invalid'));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t('validation.required'));
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
        t('login.failed_title'),
        loginError?.message || t('login.failed_message'),
        [{ text: t('common.ok') }]
      );
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign in
    Alert.alert(t('login.google_sign_in_title'), t('login.google_sign_in_message'));
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple sign in
    Alert.alert(t('login.apple_sign_in_title'), t('login.apple_sign_in_message'));
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
            {t('login.title')}
          </ThemedText>

          <Input
            label={t('auth.email')}
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
            label={t('auth.password')}
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
            <ThemedText className="text-[16px] text-primary">{t('login.forgot_password')}</ThemedText>
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
              <ThemedText className="text-[16px] font-medium text-white">{t('common.continue')}</ThemedText>
            )}
          </Pressable>

          <SignInFooter
            onGooglePress={handleGoogleSignIn}
            onApplePress={handleAppleSignIn}
            onSignInPress={() => router.push('/(auth)/signup')}
            showSignInLink
            signInLabel={t('auth.dont_have_account')}
            signInActionLabel={t('auth.sign_up')}
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
