import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { ThemedText } from '@/components/themed-text';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';
import { useCountdown } from '@/hooks/use-countdown';
import { useSignUpFlow } from '@/hooks/use-signup-flow';
import { authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/auth.types';
import { OTP_EXPIRATION_TIMEOUT, OTP_LENGTH, RESEND_CODE_TIMEOUT } from '@/lib/auth-validation';
import { router } from 'expo-router';

export default function VerifyEmailScreen() {
  const { data, updateData } = useSignUpContext();
  const { goToPrevious } = useSignUpFlow();
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(
    data.otp ? data.otp.split('') : Array(OTP_LENGTH).fill('')
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const {
    secondsLeft: resendSecondsLeft,
    restart: restartResendCountdown,
    formatTime,
  } = useCountdown(RESEND_CODE_TIMEOUT);
  const {
    secondsLeft: expirationSecondsLeft,
    restart: restartExpirationCountdown,
  } = useCountdown(OTP_EXPIRATION_TIMEOUT);

  const handleVerify = useCallback(
    async (code: string) => {
      if (isSubmitting || submittedRef.current) return;
      submittedRef.current = true;
      setIsSubmitting(true);
      setError('');

      if (expirationSecondsLeft <= 0) {
        setError('Invalid code expired. Please request a new code. Please try again');
        setIsSubmitting(false);
        submittedRef.current = false;
        setOtp(Array(OTP_LENGTH).fill(''));
        inputsRef.current[0]?.focus();
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
          case 'individual':
            router.push(AUTH_ROUTES.SIGNUP_PASSWORD);
            break;
        }
      } catch (err) {
        if (err && typeof err === 'object' && 'statusCode' in err) {
          const apiError = err as ApiError;
          const message = apiError.message?.toLowerCase() || '';
          if (message.includes('expired')) {
            setError('Invalid code expired. Please request a new code. Please try again');
          } else {
            setError('Invalid code. Please try again.');
          }
        } else {
          setError('Invalid code. Please try again.');
        }
        setOtp(Array(OTP_LENGTH).fill(''));
        inputsRef.current[0]?.focus();
      } finally {
        setIsSubmitting(false);
        submittedRef.current = false;
      }
    },
    [isSubmitting, expirationSecondsLeft, data.role, updateData]
  );

  const handleTextChange = (text: string, index: number) => {
    const char = text.slice(-1);
    if (!/^\d*$/.test(char)) return;

    setError('');
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (char && newOtp.every((val) => val.length === 1)) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendSecondsLeft > 0 || !data.email) return;

    try {
      await authService.requestEmailConfirmation(data.email);
      restartResendCountdown();
      restartExpirationCountdown();
      setError('');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } catch (err) {
      if (err && typeof err === 'object' && 'statusCode' in err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Failed to resend code. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const hasError = error.length > 0;

  return (
    <AuthLayout>
      {/* Back button - w-full keeps it left-aligned */}
      <View className="mt-6 w-full">
        <Pressable
          onPress={goToPrevious}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-full">
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
      </View>

      <View className="items-center gap-3 pt-6">
        <AuthHeader
          title="Verify your email address"
          imageSource={require('@/assets/images/icon-email-verify.svg')}
          imageWidth={IMAGE_DIMENSIONS.EMAIL_VERIFY.width}
          imageHeight={IMAGE_DIMENSIONS.EMAIL_VERIFY.height}
          description={`We will send you a One Time Password via this mail: ${data.email}`}
        />
      </View>

      {/* OTP Input */}
      <View className="w-full flex-row items-center justify-between">
        {Array.from({ length: OTP_LENGTH }, (_, index) => (
          <View
            key={index}
            className={`h-14 w-14 items-center justify-center rounded-[12px] border bg-card ${
              hasError ? 'border-red-500' : 'border-default'
            }`}>
            <TextInput
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              value={otp[index]}
              editable={!isSubmitting}
              accessibilityLabel={`OTP digit ${index + 1}`}
              className="h-full w-full text-center text-[18px] text-foreground"
            />
          </View>
        ))}
      </View>

      {/* Inline error message */}
      {hasError && <Text className="w-full text-[14px] text-red-500">{error}</Text>}

      {/* Countdown timer */}
      {resendSecondsLeft > 0 && (
        <Text className="text-[14px] text-primary">{formatTime(resendSecondsLeft)}</Text>
      )}

      {/* Spacer to push resend to bottom */}
      <View className="flex-1" />

      {/* Resend button pinned to bottom */}
      <Pressable
        onPress={handleResend}
        disabled={resendSecondsLeft > 0}
        accessibilityRole="button"
        accessibilityLabel="Re-send new code"
        className="mb-4 h-8 items-center justify-center rounded-[8px] px-2">
        <ThemedText
          className={`text-[14px] ${resendSecondsLeft > 0 ? 'text-muted-foreground' : 'text-primary'}`}>
          Re-send new code
        </ThemedText>
      </Pressable>
    </AuthLayout>
  );
}
