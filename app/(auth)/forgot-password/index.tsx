import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useForgotPasswordContext } from '@/context/ForgotPasswordContext';
import { useTheme } from '@/hooks/use-theme';
import { authService } from '@/lib/api/auth';
import { ERROR_MESSAGES, showErrorAlert } from '@/lib/error-handler';
import { validateEmail } from '@/lib/auth-validation';

export default function ForgotPasswordEmailScreen() {
  const { t } = useTranslation();
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
      setEmailError(t('validation.email_required'));
      return false;
    }
    if (!validateEmail(email)) {
      setEmailError(t('validation.email_invalid'));
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
      showErrorAlert(error, {
        fallback: ERROR_MESSAGES.SEND_RESET_CODE_FAILED,
        statusMessages: {
          0: ERROR_MESSAGES.NETWORK,
          404: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
          500: ERROR_MESSAGES.SERVER,
        },
      });
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
            accessibilityLabel={t('common.go_back')}
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
                {t('forgot_password.title')}
              </ThemedText>
            </View>

            <Input
              label={t('auth.email')}
              value={email}
              onChangeText={handleEmailChange}
              placeholder={t('forgot_password.enter_email')}
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
              accessibilityLabel={t('common.continue')}>
              {isLoading ? t('common.submitting') : t('common.continue')}
            </Button>
          </View>
        </View>
        </ThemedView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
