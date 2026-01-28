import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { IMAGE_DIMENSIONS } from '@/constants/auth';
import { useLogin } from '@/hooks/api/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { validateEmail } from '@/lib/auth-validation';

export default function LoginScreen() {
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
      await login(email.trim(), password);
      // Navigation is handled automatically by RootNavigator in _layout.tsx
      // when auth state changes
    } catch {
      // Error is already set in the hook, but we can show an alert for UX
      Alert.alert(
        'Login Failed',
        loginError?.message || 'Invalid email or password. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password navigation
    Alert.alert('Forgot Password', 'Password reset functionality coming soon.');
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

          <View className="w-full flex-row items-center justify-center gap-5">
            <View className="h-px flex-1 bg-border" />
            <ThemedText className="text-[16px] text-muted-foreground">OR</ThemedText>
            <View className="h-px flex-1 bg-border" />
          </View>

          <View className="w-full flex-row gap-4">
            <Pressable
              className="h-12 flex-1 justify-center rounded-[12px] border border-secondary bg-card px-4"
              style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
              onPress={handleGoogleSignIn}
              disabled={isLoading}>
              <View className="flex-row items-center justify-center gap-2">
                <Image
                  source={require('@/assets/images/google-icon.svg')}
                  style={{ width: 24, height: 24 }}
                  contentFit="contain"
                />
                <ThemedText>Google</ThemedText>
              </View>
            </Pressable>
            <Pressable
              className="h-12 flex-1 justify-center rounded-[12px] border border-secondary bg-card px-4"
              style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
              onPress={handleAppleSignIn}
              disabled={isLoading}>
              <View className="flex-row items-center justify-center gap-2">
                <Image
                  source={require('@/assets/images/apple-icon.svg')}
                  style={{ width: 24, height: 24 }}
                  contentFit="contain"
                />
                <ThemedText>Apple</ThemedText>
              </View>
            </Pressable>
          </View>
          <Pressable
            onPress={() => router.push('/(auth)/signup')}
            accessibilityRole="button"
            accessibilityLabel="Don't have an account? Sign up"
            className="h-12 w-full items-center justify-center rounded-[12px]"
            disabled={isLoading}>
            <ThemedText className="text-[16px] text-primary">
              Don&apos;t have an account?
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
