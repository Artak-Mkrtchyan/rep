import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PasswordRequirementsList } from '@/components/auth/password-requirements';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useForgotPasswordContext } from '@/context/ForgotPasswordContext';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useTheme } from '@/hooks/use-theme';
import { authService } from '@/lib/api/auth';
import { isPasswordValid, validatePassword } from '@/lib/auth-validation';
import { ERROR_MESSAGES, isApiError, showErrorAlert } from '@/lib/error-handler';

export default function ForgotPasswordResetScreen() {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const { data, resetData } = useForgotPasswordContext();
  const { tokens: theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { horizontalStyle } = useScreenEdgePadding();

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
      setPasswordError(t('validation.passwords_do_not_match'));
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
      setIsSuccess(true);
    } catch (error) {
      if (isApiError(error) && error.statusCode === 400) {
        setPasswordError(t('forgot_password.reset.cannot_use_current_password'));
      } else {
        showErrorAlert(error, {
          title: t('forgot_password.reset.failed_title'),
          fallback: ERROR_MESSAGES.RESET_PASSWORD_FAILED,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace(AUTH_ROUTES.LOGIN);
  };

  const handleBack = () => {
    router.back();
  };

  if (isSuccess) {
    return (
      <ThemedView className="flex-1" style={[{ paddingTop: insets.top }, horizontalStyle]}>
        <View className="flex-1 items-center justify-center gap-6">
          <Image
            style={{
              width: IMAGE_DIMENSIONS.FORGOT_PASSWORD.width,
              height: IMAGE_DIMENSIONS.FORGOT_PASSWORD.height,
            }}
            source={require('@/assets/images/icon-signup-success.svg')}
            contentFit="contain"
          />
          <ThemedText type="title" className="text-center font-semibold">
            {t('forgot_password.success.title')}
          </ThemedText>
          <ThemedText className="text-center text-[14px] text-muted-foreground">
            {t('forgot_password.success.description')}
          </ThemedText>
          <View className="mt-4 w-full">
            <Button
              onPress={handleGoToLogin}
              accessibilityLabel={t('forgot_password.success.go_home')}>
              {t('forgot_password.success.go_home')}
            </Button>
          </View>
        </View>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <ThemedView className="flex-1" style={[{ paddingTop: insets.top }, horizontalStyle]}>
          <View className="w-full flex-1">
            <View className="pt-2">
              <Pressable
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel={t('common.go_back')}
                className="h-10 w-10 items-center justify-center rounded-full">
                <Ionicons name="chevron-back" size={24} color="black" />
              </Pressable>
            </View>

            <ScrollView
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                paddingTop: 8,
                paddingBottom: 32,
              }}>
              <View className="w-full gap-5">
                <View className="items-center">
                  <Image
                    style={{
                      width: IMAGE_DIMENSIONS.FORGOT_PASSWORD.width,
                      height: IMAGE_DIMENSIONS.FORGOT_PASSWORD.height,
                    }}
                    source={require('@/assets/images/forgot-password-illustration.svg')}
                    contentFit="contain"
                  />
                </View>

                <View className="items-center gap-2">
                  <ThemedText type="title" className="text-center font-semibold leading-normal">
                    {t('forgot_password.reset.title')}
                  </ThemedText>
                </View>

                <Input
                  label={t('forgot_password.reset.new_password')}
                  value={newPassword}
                  onChangeText={handlePasswordChange}
                  placeholder={t('forgot_password.reset.enter_new_password')}
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
                  hasOnlyAllowedChars={passwordRequirements.hasOnlyAllowedChars}
                />

                <Input
                  label={t('forgot_password.reset.confirm_password')}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  placeholder={t('forgot_password.reset.confirm_new_password')}
                  secureTextEntry
                  showPasswordToggle
                  autoComplete="new-password"
                  placeholderTextColor={theme.placeholder}
                  error={
                    passwordError ||
                    (confirmPassword && !passwordsMatch
                      ? t('validation.passwords_do_not_match')
                      : undefined)
                  }
                  editable={!isLoading}
                />

                <Button
                  disabled={!canSubmit}
                  onPress={handleSubmit}
                  accessibilityLabel={t('forgot_password.reset.title')}>
                  {isLoading ? t('forgot_password.reset.resetting') : t('forgot_password.reset.title')}
                </Button>
              </View>
            </ScrollView>
          </View>
        </ThemedView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
