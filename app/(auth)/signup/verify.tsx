import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { OTP_LENGTH, RESEND_CODE_TIMEOUT } from '@/lib/auth-validation';
import { AccountRole } from '@/types/auth';

const VerifySchema = Yup.object().shape({
  otp: Yup.array()
    .of(Yup.string().required().matches(/^\d$/, 'Must be a number'))
    .min(OTP_LENGTH, `Must be ${OTP_LENGTH} digits`)
    .required(),
});

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{ role: AccountRole; email: string }>();
  const inputsRef = React.useRef<(TextInput | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_CODE_TIMEOUT);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  const handleContinue = (values: { otp: string[] }) => {
    const code = values.otp.join('');
    if (code.length !== OTP_LENGTH) return;

    router.push({
      pathname: AUTH_ROUTES.SIGNUP_BROKER,
      params: {
        role: params.role,
        email: params.email,
        otp: code,
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_CODE_TIMEOUT);
    // TODO: Trigger resend API call
  };

  const formatTime = (seconds: number): string => {
    return `00:${seconds.toString().padStart(2, '0')}`;
  };

  const handleInputFocus = (index: number) => {
    const ref = inputsRef.current[index];
    if (ref) {
      ref.focus();
    }
  };

  return (
    <AuthLayout>
      <Formik
        initialValues={{ otp: Array(OTP_LENGTH).fill('') }}
        validationSchema={VerifySchema}
        onSubmit={handleContinue}>
        {({ values, setFieldValue, handleSubmit, isValid }) => {
          const isComplete = values.otp.every((val) => val.length === 1);

          const handleTextChange = (text: string, index: number) => {
            const char = text.slice(-1);
            if (!/^\d*$/.test(char)) return;

            const newOtp = [...values.otp];
            newOtp[index] = char;
            setFieldValue('otp', newOtp);

            if (char && index < OTP_LENGTH - 1) {
              handleInputFocus(index + 1);
            }
          };

          const handleKeyPress = (e: any, index: number) => {
            if (e.nativeEvent.key === 'Backspace' && !values.otp[index] && index > 0) {
              handleInputFocus(index - 1);
            }
          };

          return (
            <>
              <View className="mt-6">
                <Pressable
                  onPress={handleBack}
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
                  description="We sent a 6‑digit code to your email. Enter it below to continue."
                />
              </View>

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
                      onChangeText={(text) => handleTextChange(text, index)}
                      onKeyPress={(event) => handleKeyPress(event, index)}
                      value={values.otp[index]}
                      accessibilityLabel={`OTP digit ${index + 1}`}
                      className="h-full w-full text-center text-[18px] text-foreground"
                    />
                  </View>
                ))}
              </View>

              <View className="w-full items-center">
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
              </View>

              <Button
                disabled={!isComplete}
                onPress={() => handleSubmit()}
                accessibilityLabel="Continue">
                Continue
              </Button>
            </>
          );
        }}
      </Formik>
    </AuthLayout>
  );
}
