import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useThemeValue } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { InputError } from '@/components/ui/input/error';
import { InputLabel } from '@/components/ui/input/label';
import type { InputProps } from '@/components/ui/input/types';

/** Figma `10597:116334` — profile phone sheet vs default token-based field */
export type PhoneInputVariant = 'default' | 'rep';

export interface PhoneInputProps extends Omit<
  InputProps,
  'value' | 'onChangeText' | 'keyboardType' | 'variant'
> {
  value?: string; // Format: "+998901211323" (full number with country code) or "901211323" (without code)
  onChangeText?: (text: string) => void; // Returns full number with country code: "+998901211323"
  countryCode?: string; // Default: "+998"
  onCountryCodeChange?: (code: string) => void;
  containerClassName?: string;
  variant?: PhoneInputVariant;
}

/**
 * Formats phone number to (XX)XXX XX XX format
 */
const formatPhoneNumber = (text: string): string => {
  const digits = text.replace(/\D/g, '').slice(0, 9);

  if (digits.length === 0) return '';

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 5) {
    return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)})${digits.slice(2, 5)} ${digits.slice(5)}`;
  }

  return `(${digits.slice(0, 2)})${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
};

/**
 * Removes formatting from phone number
 */
const unformatPhoneNumber = (text: string): string => {
  return text.replace(/\D/g, '');
};

/**
 * Extracts phone number without country code from full number
 */
const extractPhoneNumber = (fullNumber: string, countryCode: string): string => {
  if (!fullNumber) return '';
  
  // Remove country code if present
  const codeDigits = countryCode.replace(/\D/g, '');
  const numberDigits = fullNumber.replace(/\D/g, '');
  
  if (numberDigits.startsWith(codeDigits)) {
    return numberDigits.slice(codeDigits.length);
  }
  
  return numberDigits;
};

/** Figma REP phone field tokens */
const REP = {
  prefixBg: '#F7F7F6',
  border: '#E5E4E2',
  borderFocus: '#087443',
  prefixText: '#777777',
  inputText: '#18181B',
  clearIcon: '#777777',
};

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  value = '',
  onChangeText,
  countryCode = '+998',
  onCountryCodeChange,
  error,
  required,
  disabled,
  isDisabled,
  containerClassName,
  onFocus,
  onBlur,
  variant = 'default',
  ...inputProps
}) => {
  const { t } = useTranslation();
  const inputRef = React.useRef<TextInput>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const resolvedDisabled = Boolean(isDisabled ?? disabled);
  const hasError = Boolean(error);
  const placeholderColor = useThemeValue('placeholder');

  // Extract phone number without country code for display
  const displayValue = React.useMemo(() => {
    return extractPhoneNumber(value, countryCode);
  }, [value, countryCode]);

  const handleFocus = React.useCallback(
    (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = React.useCallback(
    (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleTextChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    const unformatted = unformatPhoneNumber(formatted);
    
    // Return full number with country code
    const fullNumber = countryCode + unformatted;
    onChangeText?.(fullNumber);
  };

  const wrapperClassName = cn(
    'flex-row items-center border rounded-[12px] h-12 bg-card',
    resolvedDisabled && 'opacity-50',
    hasError ? 'border-destructive' : isFocused ? 'border-primary' : 'border-default'
  );

  const rightBorderColor = hasError ? '#ef4444' : isFocused ? REP.borderFocus : REP.border;

  const handleClear = () => {
    onChangeText?.(countryCode);
  };

  if (variant === 'rep') {
    return (
      <View className={cn('w-full gap-1', containerClassName)}>
        {label ? <InputLabel required={required}>{label}</InputLabel> : null}

        <View style={[styles.repRow, resolvedDisabled && styles.disabled]}>
          <View style={[styles.repPrefix, hasError && styles.repPrefixError]}>
            <Text style={styles.repPrefixText}>{countryCode}</Text>
          </View>
          <View style={[styles.repInputWrap, { borderColor: rightBorderColor }]}>
            <View style={styles.repInputHolder}>
              <TextInput
                ref={inputRef}
                value={formatPhoneNumber(displayValue)}
                onChangeText={handleTextChange}
                editable={!resolvedDisabled}
                placeholderTextColor={REP.prefixText}
                style={styles.repInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                keyboardType="phone-pad"
                maxLength={14}
                placeholder={t('ui.phone_placeholder')}
                {...inputProps}
              />
            </View>
            {!!displayValue && !resolvedDisabled ? (
              <Pressable
                onPress={handleClear}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t('common.close', 'Clear')}>
                <Ionicons name="close" size={20} color={REP.clearIcon} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {error ? <InputError>{error}</InputError> : null}
      </View>
    );
  }

  return (
    <View className={cn('w-full gap-1', containerClassName)}>
      {label ? <InputLabel required={required}>{label}</InputLabel> : null}

      <Pressable
        className={wrapperClassName}
        onPress={() => inputRef.current?.focus()}
        disabled={resolvedDisabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: resolvedDisabled, selected: isFocused }}>
        {/* Country Code Section */}
        <View className="h-full items-center justify-center border-r border-default px-3">
          <Text className="text-[16px] text-muted-foreground">{countryCode}</Text>
        </View>

        {/* Phone Number Input */}
        <TextInput
          ref={inputRef}
          value={formatPhoneNumber(displayValue)}
          onChangeText={handleTextChange}
          editable={!resolvedDisabled}
          placeholderTextColor={inputProps.placeholderTextColor ?? placeholderColor}
          className="h-full flex-1 px-3 text-[16px] text-foreground placeholder:text-muted-foreground"
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="phone-pad"
          maxLength={14} // (XX)XXX XX XX = 14 characters
          placeholder={t('ui.phone_placeholder')}
          {...inputProps}
        />
      </Pressable>

      {error ? <InputError>{error}</InputError> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  repRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 48,
  },
  disabled: { opacity: 0.5 },
  repPrefix: {
    width: 66,
    backgroundColor: REP.prefixBg,
    borderWidth: 1,
    borderColor: REP.border,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repPrefixError: {
    borderColor: '#ef4444',
  },
  repPrefixText: {
    fontSize: 16,
    lineHeight: 24,
    color: REP.prefixText,
  },
  repInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    marginLeft: -1,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 12,
    minWidth: 0,
  },
  repInputHolder: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  repInput: {
    width: '100%',
    fontSize: 16,
    color: REP.inputText,
    padding: 0,
    margin: 0,
    ...(Platform.OS === 'android'
      ? { textAlignVertical: 'center' as const, includeFontPadding: false }
      : {}),
  },
});
