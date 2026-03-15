import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useForgotPasswordContext } from '@/context/ForgotPasswordContext';
import { useCountdown } from '@/hooks/use-countdown';
import { authService } from '@/lib/api/auth';
import { ERROR_MESSAGES, showErrorAlert } from '@/lib/error-handler';
import { OTP_LENGTH, RESEND_CODE_TIMEOUT } from '@/lib/auth-validation';

export default function ForgotPasswordVerifyScreen() {
  const { t } = useTranslation();
  const [otp, setOtp] = React.useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = React.useState(false);
  const { secondsLeft, restart: restartCountdown, formatTime } = useCountdown(RESEND_CODE_TIMEOUT);

  const inputsRef = React.useRef<(TextInput | null)[]>([]);
  const { data } = useForgotPasswordContext();

  const isOtpComplete = otp.every((val) => val.length === 1);
  const canSubmit = isOtpComplete && !isLoading;

  const handleInputFocus = (index: number) => {
    const ref = inputsRef.current[index];
    if (ref) {
      ref.focus();
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const char = text.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < OTP_LENGTH - 1) {
      handleInputFocus(index + 1);
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      handleInputFocus(index - 1);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || !data.email) return;

    try {
      await authService.sendPasswordOtp(data.email);
      restartCountdown();
      Alert.alert(t('forgot_password.verify.code_sent_title'), t('forgot_password.verify.code_sent_message'));
    } catch (error) {
      showErrorAlert(error, { fallback: ERROR_MESSAGES.RESEND_CODE_FAILED });
    }
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      const code = otp.join('');
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

            {/* OTP Input */}
            <View className="w-full">
              <ThemedText className="mb-2 text-sm font-medium">{t('forgot_password.verify.code_label')}</ThemedText>
              <View className="w-full flex-row items-center justify-between">
                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                  <View
                    key={index}
                    className="h-14 w-14 items-center justify-center rounded-[12px] border border-default bg-card">
                    <TextInput
                      ref={(element) => {
                        inputsRef.current[index] = element;
                      }}
                      keyboardType="number-pad"
                      maxLength={1}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(event) => handleOtpKeyPress(event, index)}
                      value={otp[index]}
                      accessibilityLabel={t('signup.verify.otp_digit', { number: index + 1 })}
                      className="h-full w-full text-center text-[18px] text-foreground"
                      editable={!isLoading}
                    />
                  </View>
                ))}
              </View>

              <View className="mt-2 items-center">
                {secondsLeft > 0 ? (
                  <ThemedText className="text-[14px] text-muted-foreground">
                    {t('forgot_password.verify.resend_countdown', { time: formatTime(secondsLeft) })}
                  </ThemedText>
                ) : (
                  <Pressable
                    onPress={handleResend}
                    accessibilityRole="button"
                    accessibilityLabel={t('forgot_password.verify.resend_code')}
                    className="h-8 items-center justify-center rounded-[8px] px-2">
                    <ThemedText className="text-[14px] text-primary">{t('forgot_password.verify.resend_code')}</ThemedText>
                  </Pressable>
                )}
              </View>
            </View>

            <Button disabled={!canSubmit} onPress={handleConfirm} accessibilityLabel={t('forgot_password.verify.verify_button')}>
              {isLoading ? t('forgot_password.verify.verifying') : t('forgot_password.verify.verify_button')}
            </Button>
          </View>
        </View>
        </ThemedView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
