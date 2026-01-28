import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';

import { PasswordRequirementsList } from '@/components/auth/password-requirements';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useForgotPasswordContext } from '@/context/ForgotPasswordContext';
import { useTheme } from '@/hooks/use-theme';
import { authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/auth.types';
import {
  OTP_LENGTH,
  RESEND_CODE_TIMEOUT,
  isPasswordValid,
  validatePassword,
} from '@/lib/auth-validation';

export default function ForgotPasswordResetScreen() {
  const [otp, setOtp] = React.useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_CODE_TIMEOUT);

  const inputsRef = React.useRef<(TextInput | null)[]>([]);
  const { data, resetData } = useForgotPasswordContext();
  const { tokens: theme } = useTheme();

  const passwordRequirements = validatePassword(newPassword);
  const isOtpComplete = otp.every((val) => val.length === 1);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit =
    isOtpComplete && isPasswordValid(passwordRequirements) && passwordsMatch && !isLoading;

  React.useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  // const formatTime = (seconds: number): string => {
  //   return `00:${seconds.toString().padStart(2, '0')}`;
  // };

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

  const handlePasswordChange = (text: string) => {
    setNewPassword(text);
    setPasswordError(null);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordError(null);
  };

  // const handleResend = async () => {
  //   if (secondsLeft > 0 || !data.email) return;

  //   try {
  //     await authService.requestPasswordReset(data.email, data.scope);
  //     setSecondsLeft(RESEND_CODE_TIMEOUT);
  //     Alert.alert('Code Sent', 'A new reset code has been sent to your email.');
  //   } catch (error) {
  //     if (error instanceof Error && 'statusCode' in error) {
  //       const apiError = error as ApiError;
  //       Alert.alert('Error', apiError.message || 'Failed to resend code. Please try again.');
  //     } else {
  //       Alert.alert('Error', 'An unexpected error occurred. Please try again.');
  //     }
  //   }
  // };

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
        otp: otp.join(''),
      });

      resetData();
      Alert.alert('Success', 'Your password has been reset successfully.', [
        {
          text: 'OK',
          onPress: () => router.replace(AUTH_ROUTES.LOGIN),
        },
      ]);
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        const apiError = error as ApiError;
        Alert.alert(
          'Reset Failed',
          apiError.message || 'Failed to reset password. Please check the code and try again.'
        );
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

              {/* <View className="mt-2 items-center">
                {secondsLeft > 0 ? (
                  <Text className="text-[14px] text-muted-foreground">
                    Resend code in {formatTime(secondsLeft)}
                  </Text>
                ) : (
                  <Pressable
                    onPress={handleResend}
                    accessibilityRole="button"
                    accessibilityLabel="Resend code"
                    className="h-8 items-center justify-center rounded-[8px] px-2">
                    <ThemedText className="text-[14px] text-primary">Resend code</ThemedText>
                  </Pressable>
                )}
              </View> */}
            </View>

            {/* New Password */}
            <Input
              label="New Password"
              value={newPassword}
              onChangeText={handlePasswordChange}
              placeholder="Enter new password"
              secureTextEntry
              autoComplete="new-password"
              placeholderTextColor={theme.placeholder}
              editable={!isLoading}
            />

            <PasswordRequirementsList
              hasMinLength={passwordRequirements.hasMinLength}
              hasUpperCase={passwordRequirements.hasUpperCase}
              hasNumber={passwordRequirements.hasNumber}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              placeholder="Confirm new password"
              secureTextEntry
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
    </KeyboardAvoidingView>
  );
}
