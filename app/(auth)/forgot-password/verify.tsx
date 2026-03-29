import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OtpInput } from '@/components/auth/otp-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useForgotPasswordContext } from '@/context/ForgotPasswordContext';
import { useOtpResend } from '@/hooks/use-otp-resend';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { authService } from '@/lib/api/auth';
import { ERROR_MESSAGES, showErrorAlert } from '@/lib/error-handler';
import { OTP_EXPIRATION_TIMEOUT } from '@/lib/auth-validation';

export default function ForgotPasswordVerifyScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useForgotPasswordContext();
  const otpRef = useRef('');

  const insets = useSafeAreaInsets();
  const { horizontalStyle } = useScreenEdgePadding();

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

  const runVerify = useCallback(
    async (code: string) => {
      if (!code || code.length !== 6 || isLoading) return;

      setIsLoading(true);
      try {
        await authService.confirmPasswordOtp(code);
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
    },
    [isLoading]
  );

  const handleOtpComplete = useCallback(
    (code: string) => {
      otpRef.current = code;
      void runVerify(code);
    },
    [runVerify]
  );

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <ThemedView className="flex-1 bg-background" style={[{ paddingTop: insets.top }, horizontalStyle]}>
          <View className="w-full flex-1">
            <View className="pt-2">
              <Pressable
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel={t('common.go_back')}
                className="h-10 w-10 items-center justify-center rounded-full">
                <Ionicons name="chevron-back" size={24} color="#111111" />
              </Pressable>
            </View>

            <View className="flex-1">
              <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingTop: 16,
                  paddingBottom: 16,
                }}>
                <View className="w-full max-w-[358px] flex-col gap-4 self-center">
                  <View className="w-full max-w-[324px] items-center gap-4 self-center">
                    <Image
                      style={{
                        width: IMAGE_DIMENSIONS.EMAIL_VERIFY.width,
                        height: IMAGE_DIMENSIONS.EMAIL_VERIFY.height,
                      }}
                      source={require('@/assets/images/icon-email-verify.svg')}
                      contentFit="contain"
                    />
                    <ThemedText type="title" className="text-center text-foreground">
                      {t('forgot_password.verify.title')}
                    </ThemedText>
                  </View>

                  {data.email ? (
                    <ThemedText className="text-center text-[16px] leading-6 text-muted-foreground">
                      <Trans
                        i18nKey="forgot_password.verify.description"
                        values={{ email: data.email }}
                        components={{
                          emailStyle: (
                            <Text className="text-[16px] leading-6 text-muted-foreground" />
                          ),
                        }}
                      />
                    </ThemedText>
                  ) : null}

                  <OtpInput
                    disabled={isLoading}
                    hideResend
                    onChange={(code) => {
                      otpRef.current = code;
                    }}
                    onComplete={handleOtpComplete}
                    countdownSecondsLeft={secondsLeft}
                    countdownLabel={secondsLeft > 0 ? formatTime(secondsLeft) : undefined}
                    canResend={canResend}
                    onResend={handleResend}
                    resendLabel={t('forgot_password.verify.resend_new_code')}
                  />
                </View>
              </ScrollView>

              <View style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
                <Pressable
                  onPress={handleResend}
                  disabled={secondsLeft > 0 || !canResend || isLoading}
                  accessibilityRole="button"
                  accessibilityLabel={t('forgot_password.verify.resend_new_code')}
                  className="h-12 w-full items-center justify-center">
                  <ThemedText
                    className={`text-[18px] font-medium leading-6 ${
                      secondsLeft > 0 || !canResend || isLoading ? 'text-muted-foreground' : 'text-primary'
                    }`}>
                    {t('forgot_password.verify.resend_new_code')}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </ThemedView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
