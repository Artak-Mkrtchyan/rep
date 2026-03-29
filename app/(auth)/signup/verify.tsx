import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { OtpInput, type OtpInputHandle } from '@/components/auth/otp-input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';
import { useOtpResend } from '@/hooks/use-otp-resend';
import { useSignUpFlow } from '@/hooks/use-signup-flow';
import { authService } from '@/lib/api/auth';
import { ERROR_MESSAGES, getApiErrorMessage, isApiError } from '@/lib/error-handler';
import { OTP_EXPIRATION_TIMEOUT } from '@/lib/auth-validation';
import { router } from 'expo-router';

export default function VerifyEmailScreen() {
  const { t } = useTranslation();
  const { data, updateData } = useSignUpContext();
  const { goToPrevious } = useSignUpFlow();
  const otpInputRef = useRef<OtpInputHandle>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const resendFn = useCallback(async () => {
    if (!data.email) return;
    try {
      await authService.requestEmailConfirmation(data.email);
      setError('');
      otpInputRef.current?.reset();
    } catch (err) {
      setError(getApiErrorMessage(err, ERROR_MESSAGES.RESEND_CODE_FAILED));
      throw err;
    }
  }, [data.email]);

  const { secondsLeft, canResend, resend, formatTime } = useOtpResend({
    countdownSeconds: OTP_EXPIRATION_TIMEOUT,
    resendFn,
  });

  const handleVerify = useCallback(
    async (code: string) => {
      if (isSubmitting || submittedRef.current) return;
      submittedRef.current = true;
      setIsSubmitting(true);
      setError('');

      if (secondsLeft <= 0) {
        setError(t('signup.verify.code_expired'));
        setIsSubmitting(false);
        submittedRef.current = false;
        otpInputRef.current?.reset();
        return;
      }

      try {
        await authService.confirmEmail(code);
        updateData({ otp: code });

        switch (data.role) {
          case 'broker':
            router.push(AUTH_ROUTES.SIGNUP_BROKER);
            break;
          case 'broker_company':
            router.push(AUTH_ROUTES.SIGNUP_BROKER_COMPANY);
            break;
          case 'company':
            router.push(AUTH_ROUTES.SIGNUP_CONSTRUCTION_COMPANY);
            break;
          case 'individual':
            router.push(AUTH_ROUTES.SIGNUP_PASSWORD);
            break;
        }
      } catch (err) {
        if (isApiError(err)) {
          const message = err.message?.toLowerCase() || '';
          if (message.includes('expired')) {
            setError(t('signup.verify.code_expired'));
          } else {
            setError(t('signup.verify.invalid_code'));
          }
        } else {
          setError(t('signup.verify.invalid_code'));
        }
        otpInputRef.current?.reset();
      } finally {
        setIsSubmitting(false);
        submittedRef.current = false;
      }
    },
    [isSubmitting, secondsLeft, data.role, updateData, t]
  );

  return (
    <AuthLayout>
      {/* Back button - w-full keeps it left-aligned */}
      <View className="mt-6 w-full">
        <Pressable
          onPress={goToPrevious}
          accessibilityRole="button"
          accessibilityLabel={t('common.go_back')}
          className="h-10 w-10 items-center justify-center rounded-full">
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
      </View>

      <View className="items-center gap-3 pt-6">
        <AuthHeader
          title={t('signup.verify.title')}
          imageSource={require('@/assets/images/icon-email-verify.svg')}
          imageWidth={IMAGE_DIMENSIONS.EMAIL_VERIFY.width}
          imageHeight={IMAGE_DIMENSIONS.EMAIL_VERIFY.height}
          description={t('signup.verify.description', { email: data.email })}
        />
      </View>

      <OtpInput
        ref={otpInputRef}
        error={error}
        disabled={isSubmitting}
        initialValue={data.otp}
        onComplete={handleVerify}
        onChange={() => setError('')}
        countdownSecondsLeft={secondsLeft}
        countdownDisplay={formatTime(secondsLeft)}
        canResend={canResend}
        onResend={resend}
        resendLabel={t('signup.verify.resend_code')}
      />

      {/* Spacer to push resend to bottom */}
      <View className="flex-1" />
    </AuthLayout>
  );
}
