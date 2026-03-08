import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { PasswordRequirementsList } from '@/components/auth/password-requirements';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useForgotPasswordContext } from '@/context/ForgotPasswordContext';
import { useTheme } from '@/hooks/use-theme';
import { authService } from '@/lib/api/auth';
import { ERROR_MESSAGES, showErrorAlert } from '@/lib/error-handler';
import { isPasswordValid, validatePassword } from '@/lib/auth-validation';

export default function ForgotPasswordResetScreen() {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { data, resetData } = useForgotPasswordContext();
  const { tokens: theme } = useTheme();

  const passwordRequirements = validatePassword(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = isPasswordValid(passwordRequirements) && passwordsMatch && !isLoading;

  const handlePasswordChange = (text: string) => {
    setNewPassword(text);
    setPasswordError(null);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordError(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (!passwordsMatch) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: data.email,
        scope: data.scope,
        newPassword,
        usingOtp: true,
      });

      resetData();
      Alert.alert('Success', 'Your password has been reset successfully.', [
        {
          text: 'OK',
          onPress: () => router.replace(AUTH_ROUTES.LOGIN),
        },
      ]);
    } catch (error) {
      showErrorAlert(error, { title: 'Reset Failed', fallback: ERROR_MESSAGES.RESET_PASSWORD_FAILED });
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
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
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

          <View className="flex-1 items-center pt-6">
            <View className="w-[358px] max-w-full items-center gap-5">
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
                  Reset Password
                </ThemedText>
              </View>

              {/* New Password */}
              <Input
                label="New Password"
                value={newPassword}
                onChangeText={handlePasswordChange}
                placeholder="Enter new password"
                secureTextEntry
                showPasswordToggle
                autoComplete="new-password"
                placeholderTextColor={theme.placeholder}
                editable={!isLoading}
              />

              <PasswordRequirementsList
                hasMinLength={passwordRequirements.hasMinLength}
                hasUpperCase={passwordRequirements.hasUpperCase}
                hasLowerCase={passwordRequirements.hasLowerCase}
                hasNumber={passwordRequirements.hasNumber}
                hasSymbol={passwordRequirements.hasSymbol}
              />

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                placeholder="Confirm new password"
                secureTextEntry
                showPasswordToggle
                autoComplete="new-password"
                placeholderTextColor={theme.placeholder}
                error={
                  passwordError ||
                  (confirmPassword && !passwordsMatch ? 'Passwords do not match' : undefined)
                }
                editable={!isLoading}
              />

              <Button
                disabled={!canSubmit}
                onPress={handleSubmit}
                accessibilityLabel="Reset password">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </View>
          </View>
        </ThemedView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
