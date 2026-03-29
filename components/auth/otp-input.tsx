import React, { useCallback, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { OTP_LENGTH } from '@/lib/auth-validation';

export interface OtpInputHandle {
  reset: () => void;
}

interface OtpInputProps {
  /** Error message to display below the input */
  error?: string;
  /** Whether the input fields are disabled */
  disabled?: boolean;
  /** Initial OTP value (e.g. from context) */
  initialValue?: string;
  /** Called when all digits are filled */
  onComplete?: (code: string) => void;
  /** Called when OTP value changes */
  onChange?: (code: string) => void;
  /** Countdown seconds left (shows timer when > 0) */
  countdownSecondsLeft?: number;
  /** Formatted countdown string */
  countdownDisplay?: string;
  /** Whether resend is available */
  canResend?: boolean;
  /** Resend button handler */
  onResend?: () => void;
  /** Label for the resend button */
  resendLabel: string;
  /** Label for the countdown (with {time} placeholder already resolved) */
  countdownLabel?: string;
}

export const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(function OtpInput(
  {
    error,
    disabled = false,
    initialValue,
    onComplete,
    onChange,
    countdownSecondsLeft = 0,
    countdownDisplay,
    canResend = false,
    onResend,
    resendLabel,
    countdownLabel,
  },
  ref
) {
  const { t } = useTranslation();
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(
    initialValue ? initialValue.split('') : Array(OTP_LENGTH).fill('')
  );

  const hasError = !!error && error.length > 0;

  const reset = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(''));
    inputsRef.current[0]?.focus();
  }, []);

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  const handleTextChange = useCallback(
    (text: string, index: number) => {
      const char = text.slice(-1);
      if (!/^\d*$/.test(char)) return;

      const newOtp = [...otp];
      newOtp[index] = char;
      setOtp(newOtp);

      if (char && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      const code = newOtp.join('');
      onChange?.(code);

      if (char && newOtp.every((val) => val.length === 1)) {
        onComplete?.(code);
      }
    },
    [otp, onChange, onComplete]
  );

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  return (
    <View className="w-full items-end gap-[8px]">
      <View className="flex-row items-center gap-[4px]">
        {Array.from({ length: OTP_LENGTH }, (_, index) => (
          <View
            key={index}
            className={`h-[56px] w-[56px] items-center justify-center rounded-[6px] border bg-card ${
              hasError ? 'border-red-500' : 'border-[#E2E2E2]'
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
              editable={!disabled}
              accessibilityLabel={t('signup.verify.otp_digit', { number: index + 1 })}
              className="h-full w-full text-center text-[20px] font-semibold text-foreground"
            />
          </View>
        ))}
      </View>

      {hasError && <Text className="w-full text-[14px] text-red-500">{error}</Text>}

      <View className="w-full items-center">
        {countdownSecondsLeft > 0 ? (
          <ThemedText className="text-[16px] font-medium text-primary">
            {countdownLabel ?? countdownDisplay}
          </ThemedText>
        ) : onResend ? (
          <Pressable
            onPress={onResend}
            disabled={!canResend}
            accessibilityRole="button"
            accessibilityLabel={resendLabel}
            className="h-[48px] items-center justify-center rounded-[6px] px-[16px] py-[8px]">
            <ThemedText
              className={`text-[18px] font-medium ${canResend ? 'text-primary' : 'text-muted-foreground'}`}>
              {resendLabel}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});
