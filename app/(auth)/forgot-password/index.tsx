import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useForgotPasswordContext } from '@/context/ForgotPasswordContext';
import { useTheme } from '@/hooks/use-theme';
import { authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/auth.types';
import { validateEmail } from '@/lib/auth-validation';

export default function ForgotPasswordEmailScreen() {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { updateData, data } = useForgotPasswordContext();
  const { tokens: theme } = useTheme();

  React.useEffect(() => {
    if (data.email) {
      setEmail(data.email);
    }
  }, [data.email]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(null);
  };

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await authService.sendPasswordOtp(email.trim());
      updateData({ email: email.trim() });
      router.push(AUTH_ROUTES.FORGOT_PASSWORD_VERIFY);
    } catch (error) {
      console.error('Password reset error:', error);

      if (error && typeof error === 'object' && 'statusCode' in error) {
        const apiError = error as ApiError;

        // More detailed error messages
        let errorMessage = apiError.message || 'Failed to send reset code. Please try again.';

        if (apiError.statusCode === 0) {
          errorMessage =
            'Network error: Unable to reach the server. Please check your internet connection and try again.';
        } else if (apiError.statusCode === 404) {
          errorMessage =
            'The password reset service is currently unavailable. Please try again later.';
        } else if (apiError.statusCode === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        }

        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ThemedView className="flex-1 px-4">
        <View className="mt-6">
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-10 w-10 items-center justify-center rounded-full">
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="w-[358px] max-w-full items-center gap-6">
            <Image
              style={{
                width: IMAGE_DIMENSIONS.FORGOT_PASSWORD.width,
                height: IMAGE_DIMENSIONS.FORGOT_PASSWORD.height,
              }}
              source={require('@/assets/images/forgot-password-illustration.svg')}
              contentFit="contain"
            />

            <View className="items-center gap-2">
              <ThemedText type="title" className="text-center">
                Forgot password?
              </ThemedText>
            </View>

            <Input
              label="Email"
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              placeholderTextColor={theme.placeholder}
              error={emailError || undefined}
              editable={!isLoading}
            />

            <Button
              disabled={!email.trim() || isLoading}
              onPress={handleContinue}
              accessibilityLabel="Continue">
              {isLoading ? 'Submitting...' : 'Continue'}
            </Button>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
