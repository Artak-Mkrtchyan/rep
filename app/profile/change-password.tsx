import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PasswordRequirementsList } from '@/components/auth/password-requirements';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';
import { useUserClaims } from '@/hooks/use-user-claims';
import { authService } from '@/lib/api/auth';
import { ERROR_MESSAGES, showErrorAlert } from '@/lib/error-handler';
import { doPasswordsMatch, isPasswordValid, validatePassword } from '@/lib/auth-validation';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const userClaims = useUserClaims();
  const { tokens: theme } = useTheme();

  const passwordRequirements = validatePassword(newPassword);
  const passwordsMatch = doPasswordsMatch(newPassword, confirmPassword);
  const canSubmit =
    currentPassword.length > 0 &&
    isPasswordValid(passwordRequirements) &&
    passwordsMatch &&
    !isLoading;

  const handleCurrentPasswordChange = (text: string) => {
    setCurrentPassword(text);
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  const handleSubmit = async () => {
    if (!canSubmit || !userClaims) return;

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: userClaims.email,
        scope: userClaims.scope,
        newPassword,
        oldPassword: currentPassword,
        usingOtp: false,
      });

      Alert.alert('Success', 'Your password has been changed successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      showErrorAlert(error, { title: 'Change Password Failed', fallback: ERROR_MESSAGES.CHANGE_PASSWORD_FAILED });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <ThemedView className="flex-1 px-4">
          <SafeAreaView className="flex-1" edges={['top']}>
            <View className="mt-2">
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                className="h-10 w-10 items-center justify-center rounded-full">
                <Ionicons name="chevron-back" size={24} color={theme.foreground} />
              </Pressable>
            </View>

            <View className="flex-1 items-center pt-4">
              <View className="w-full max-w-full items-center gap-5">
                <ThemedText type="title" className="text-center">
                  Change Password
                </ThemedText>

                <Input
                  label="Current Password"
                  value={currentPassword}
                  onChangeText={handleCurrentPasswordChange}
                  placeholder="Enter current password"
                  secureTextEntry
                  showPasswordToggle
                  autoComplete="current-password"
                  placeholderTextColor={theme.placeholder}
                  editable={!isLoading}
                />

                <Input
                  label="New Password"
                  value={newPassword}
                  onChangeText={handleNewPasswordChange}
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

                <Input
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  placeholder="Confirm new password"
                  secureTextEntry
                  showPasswordToggle
                  autoComplete="new-password"
                  placeholderTextColor={theme.placeholder}
                  error={confirmPassword && !passwordsMatch ? 'Passwords do not match' : undefined}
                  editable={!isLoading}
                />

                <Button
                  disabled={!canSubmit}
                  onPress={handleSubmit}
                  accessibilityLabel="Change password">
                  {isLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </View>
            </View>
          </SafeAreaView>
        </ThemedView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
