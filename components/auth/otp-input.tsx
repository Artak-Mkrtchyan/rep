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
  /** When true, resend is not rendered here (e.g. host screen places it at the bottom). */
  hideResend?: boolean;
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
    hideResend = false,
  },
  ref
) {
  const { t } = useTranslation();
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(
    initialValue ? initialValue.split('') : Array(OTP_LENGTH).fill('')
  );
  // Mirror state in a ref so event handlers can read the latest value
  // without using the setState updater form (which must stay pure).
  const otpRef = useRef(otp);
  otpRef.current = otp;

  const hasError = !!error && error.length > 0;

  const reset = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(''));
    inputsRef.current[0]?.focus();
  }, []);

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  const handleTextChange = useCallback(
    (text: string, index: number) => {
      // Handle paste: if text has multiple digits and matches OTP length, fill all fields
      const digits = text.replace(/\D/g, '');
      if (digits.length >= OTP_LENGTH) {
        const pastedDigits = digits.slice(0, OTP_LENGTH);
        const newOtp = pastedDigits.split('');
        // Clear the native input that received the paste to avoid flash of all digits
        inputsRef.current[index]?.setNativeProps({ text: newOtp[index] });
        setOtp(newOtp);
        inputsRef.current[OTP_LENGTH - 1]?.focus();
        const code = newOtp.join('');
        onChange?.(code);
        // Defer so React commits the filled state before the verify request
        setTimeout(() => onComplete?.(code), 0);
        return;
      }

      const char = text.slice(-1);
      if (!/^\d*$/.test(char)) return;

      const newOtp = [...otpRef.current];
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
    [onChange, onComplete]
  );

  const handleKeyPress = useCallback((e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpRef.current[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }, []);

  return (
    <View className="w-full items-center gap-2">
      <View className="flex-row items-center justify-center gap-1">
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

      {hasError && (
        <Text className="w-full text-center text-[14px] leading-5 text-red-500">{error}</Text>
      )}

      {countdownSecondsLeft > 0 ? (
        <View className="h-6 w-full items-center justify-center">
          <ThemedText className="text-center text-[16px] font-medium leading-6 text-primary">
            {countdownLabel ?? countdownDisplay}
          </ThemedText>
        </View>
      ) : !hideResend && onResend ? (
        <Pressable
          onPress={onResend}
          disabled={!canResend}
          accessibilityRole="button"
          accessibilityLabel={resendLabel}
          className="h-12 w-full items-center justify-center rounded-[6px] px-4 py-2">
          <ThemedText
            className={`text-[18px] font-medium ${canResend ? 'text-primary' : 'text-muted-foreground'}`}>
            {resendLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
});
