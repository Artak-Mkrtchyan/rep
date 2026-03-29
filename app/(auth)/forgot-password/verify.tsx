import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { OtpInput } from '@/components/auth/otp-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useForgotPasswordContext } from '@/context/ForgotPasswordContext';
import { useOtpResend } from '@/hooks/use-otp-resend';
import { authService } from '@/lib/api/auth';
import { ERROR_MESSAGES, showErrorAlert } from '@/lib/error-handler';
import { OTP_EXPIRATION_TIMEOUT } from '@/lib/auth-validation';

export default function ForgotPasswordVerifyScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useForgotPasswordContext();
  const otpRef = useRef('');

  const resendFn = useCallback(async () => {
    if (!data.email) return;
    await authService.sendPasswordOtp(data.email);
    Alert.alert(
      t('forgot_password.verify.code_sent_title'),
      t('forgot_password.verify.code_sent_message')
    );
  }, [data.email, t]);

  const { secondsLeft, canResend, resend, formatTime } = useOtpResend({
    countdownSeconds: OTP_EXPIRATION_TIMEOUT,
    resendFn,
  });

  const handleResend = useCallback(async () => {
    try {
      await resend();
    } catch (error) {
      showErrorAlert(error, { fallback: ERROR_MESSAGES.RESEND_CODE_FAILED });
    }
  }, [resend]);

  const handleConfirm = async () => {
    if (!otpRef.current || otpRef.current.length !== 6 || isLoading) return;

    setIsLoading(true);
    try {
      await authService.confirmPasswordOtp(otpRef.current);
      router.push(AUTH_ROUTES.FORGOT_PASSWORD_RESET);
    } catch (error) {
      showErrorAlert(error, {
        fallback: ERROR_MESSAGES.INVALID_CODE,
        statusMessages: {
          0: ERROR_MESSAGES.NETWORK,
          400: ERROR_MESSAGES.INVALID_CODE,
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
                  {t('forgot_password.verify.title')}
                </ThemedText>
                {data.email ? (
                  <ThemedText className="text-center text-sm text-muted-foreground">
                    {t('forgot_password.verify.description', { email: data.email })}
                  </ThemedText>
                ) : null}
              </View>

              <OtpInput
                disabled={isLoading}
                onChange={(code) => {
                  otpRef.current = code;
                }}
                countdownSecondsLeft={secondsLeft}
                countdownLabel={t('forgot_password.verify.resend_countdown', {
                  time: formatTime(secondsLeft),
                })}
                canResend={canResend}
                onResend={handleResend}
                resendLabel={t('forgot_password.verify.resend_code')}
              />

              <Button
                disabled={isLoading}
                onPress={handleConfirm}
                accessibilityLabel={t('forgot_password.verify.verify_button')}>
                {isLoading
                  ? t('forgot_password.verify.verifying')
                  : t('forgot_password.verify.verify_button')}
              </Button>
            </View>
          </View>
        </ThemedView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
