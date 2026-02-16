import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useForgotPasswordContext } from '@/context/ForgotPasswordContext';
import { useCountdown } from '@/hooks/use-countdown';
import { authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/auth.types';
import { OTP_LENGTH, RESEND_CODE_TIMEOUT } from '@/lib/auth-validation';

export default function ForgotPasswordVerifyScreen() {
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
      Alert.alert('Code Sent', 'A new reset code has been sent to your email.');
    } catch (error) {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const apiError = error as ApiError;
        Alert.alert('Error', apiError.message || 'Failed to resend code. Please try again.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
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
      console.error('OTP confirmation error:', error);

      if (error && typeof error === 'object' && 'statusCode' in error) {
        const apiError = error as ApiError;

        let errorMessage = apiError.message || 'Invalid verification code. Please try again.';

        if (apiError.statusCode === 0) {
          errorMessage =
            'Network error: Unable to reach the server. Please check your internet connection and try again.';
        } else if (apiError.statusCode === 400) {
          errorMessage = 'Invalid or expired verification code. Please try again.';
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
                Verify Code
              </ThemedText>
              {data.email ? (
                <ThemedText className="text-center text-sm text-muted-foreground">
                  Enter the code sent to {data.email}
                </ThemedText>
              ) : null}
            </View>

            {/* OTP Input */}
            <View className="w-full">
              <ThemedText className="mb-2 text-sm font-medium">Verification Code</ThemedText>
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
                      accessibilityLabel={`OTP digit ${index + 1}`}
                      className="h-full w-full text-center text-[18px] text-foreground"
                      editable={!isLoading}
                    />
                  </View>
                ))}
              </View>

              <View className="mt-2 items-center">
                {secondsLeft > 0 ? (
                  <ThemedText className="text-[14px] text-muted-foreground">
                    Resend code in {formatTime(secondsLeft)}
                  </ThemedText>
                ) : (
                  <Pressable
                    onPress={handleResend}
                    accessibilityRole="button"
                    accessibilityLabel="Resend code"
                    className="h-8 items-center justify-center rounded-[8px] px-2">
                    <ThemedText className="text-[14px] text-primary">Resend code</ThemedText>
                  </Pressable>
                )}
              </View>
            </View>

            <Button disabled={!canSubmit} onPress={handleConfirm} accessibilityLabel="Verify code">
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
