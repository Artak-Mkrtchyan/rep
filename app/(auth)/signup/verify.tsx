import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';

const OTP_LENGTH = 6 as const;

export default function VerifyEmailScreen() {
  const [values, setValues] = React.useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => '')
  );
  const inputsRef = React.useRef<(TextInput | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = React.useState(60);

  const code = values.join('');
  const canContinue = code.length === OTP_LENGTH && values.every((v) => v.length === 1);

  const focusIndex = (index: number) => {
    const ref = inputsRef.current[index];
    if (ref) ref.focus();
  };

  const handleChangeAt = (index: number, text: string) => {
    const char = text.slice(-1);
    const next = [...values];
    next[index] = char;
    setValues(next);
    if (char && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyPressAt = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace' && !values[index] && index > 0) {
      focusIndex(index - 1);
    }
  };

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const handleContinue = () => {
    if (!canContinue) return;
    router.push('/(auth)/signup/broker');
  };

  const handleBack = () => {
    router.back();
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(60);
    // trigger resend here
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

        <View className="w-[358px] max-w-full items-center gap-6">
          <View className="items-center gap-3 pt-6">
            <Image
              style={{ width: 102, height: 102 }}
              source={require('@/assets/images/icon-email-verify.svg')}
              contentFit="contain"
            />
            <ThemedText type="title" className="text-center">
              Verify your email address
            </ThemedText>
          </View>
          <ThemedText className="text-center text-muted-foreground">
            We sent a 6‑digit code to your email. Enter it below to continue.
          </ThemedText>

          <View className="w-full flex-row items-center justify-between">
            {Array.from({ length: OTP_LENGTH }, (_, i) => (
              <View
                key={i}
                className="border-default h-14 w-14 items-center justify-center rounded-[12px] border bg-card">
                <TextInput
                  ref={(el) => (inputsRef.current[i] = el)}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(t) => handleChangeAt(i, t)}
                  onKeyPress={(e) => handleKeyPressAt(i, e)}
                  value={values[i]}
                  accessibilityLabel={`OTP digit ${i + 1}`}
                  className="h-full w-full text-center text-[18px] text-foreground"
                />
              </View>
            ))}
          </View>

          <View className="w-full items-center">
            {secondsLeft > 0 ? (
              <Text className="text-[14px] text-muted-foreground">
                Resend code in 00:{secondsLeft.toString().padStart(2, '0')}
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

          <Pressable
            disabled={!canContinue}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            className={`h-[50px] w-full items-center justify-center rounded-[12px] ${
              canContinue ? 'bg-primary' : 'bg-input'
            }`}
            style={({ pressed }) => (pressed && canContinue ? { opacity: 0.9 } : undefined)}>
            <ThemedText className="text-[16px] font-medium text-white">Continue</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
