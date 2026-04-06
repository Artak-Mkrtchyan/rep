import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeValue } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { InputError } from './error';
import { InputLabel } from './label';
import { InputLeftView } from './left-view';
import { InputRightView } from './right-view';

import { Image } from 'expo-image';
import type { InputProps } from './types';

export const Input = React.forwardRef(function Input(
  {
    label,
    helper,
    description,
    error,
    isInvalid,
    invalid,
    required,
    isDisabled,
    disabled,
    size = 'md',
    variant = 'default',
    containerClassName,
    inputClassName,
    left,
    right,
    leftIcon,
    rightIcon,
    showPasswordToggle,
    afterField,
    numericOnly,
    allowDecimal,
    onFocus,
    onBlur,
    secureTextEntry,
    textContentType: textContentTypeProp,
    onChangeText,
    ...props
  }: InputProps,
  ref: React.Ref<TextInput>
) {
  const inputRef = React.useRef<TextInput | null>(null);
  const secureInputRef = React.useRef<TextInput | null>(null);
  const plainInputRef = React.useRef<TextInput | null>(null);
  React.useImperativeHandle(ref, () => inputRef.current as TextInput);

  const { t } = useTranslation();
  const [isFocused, setIsFocused] = React.useState(false);
  const [isSecure, setIsSecure] = React.useState(!!secureTextEntry);
  const resolvedDisabled = Boolean(isDisabled ?? disabled);
  const hasError = Boolean(isInvalid ?? invalid ?? error);
  const placeholderColor = useThemeValue('placeholder');

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

  const filterNumeric = React.useCallback(
    (text: string): string => {
      if (!numericOnly) return text;
      const filtered = text.replace(new RegExp(`[^${allowDecimal ? '0-9.' : '0-9'}]`, 'g'), '');
      if (!allowDecimal) return filtered;
      const parts = filtered.split('.');
      if (parts.length <= 2) return filtered;
      return `${parts[0]}.${parts.slice(1).join('')}`;
    },
    [numericOnly, allowDecimal]
  );

  const handleChangeText = React.useCallback(
    (text: string) => {
      const next = numericOnly ? filterNumeric(text) : text;
      onChangeText?.(next);
    },
    [onChangeText, numericOnly, filterNumeric]
  );

  // iOS: toggling `secureTextEntry` on one TextInput breaks Backspace. Keep two inputs mounted
  // (masked + plain), fixed `secureTextEntry` on each, and only swap focus / pointer-events.
  const prevIsSecure = React.useRef<boolean | undefined>(undefined);
  React.useLayoutEffect(() => {
    if (showPasswordToggle) {
      inputRef.current = isSecure ? secureInputRef.current : plainInputRef.current;
    }
    if (!showPasswordToggle) return;
    if (prevIsSecure.current === undefined) {
      prevIsSecure.current = isSecure;
      return;
    }
    if (prevIsSecure.current === isSecure) return;
    prevIsSecure.current = isSecure;
    const id = requestAnimationFrame(() => {
      (isSecure ? secureInputRef : plainInputRef).current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isSecure, showPasswordToggle]);

  const sizeClasses =
    size === 'sm'
      ? 'h-10 rounded-[10px] px-3'
      : size === 'lg'
        ? 'h-14 rounded-[14px] px-4'
        : 'h-12 rounded-[12px] px-3';

  const passwordStackMinHeightClass =
    size === 'sm' ? 'min-h-10' : size === 'lg' ? 'min-h-14' : 'min-h-12';

  const variantClasses =
    variant === 'ghost' ? 'bg-transparent' : resolvedDisabled ? 'bg-muted' : 'bg-card';

  const wrapperClassName = cn(
    'flex-row items-center border',
    sizeClasses,
    variantClasses,
    resolvedDisabled && 'border-default',
    !resolvedDisabled &&
      (hasError ? 'border-destructive' : isFocused ? 'border-primary' : 'border-default')
  );

  const inputClassNames = cn(
    'h-full flex-1 text-[16px] text-foreground placeholder:text-muted-foreground',
    inputClassName
  );

  const keyboardTypeResolved = numericOnly
    ? allowDecimal
      ? 'decimal-pad'
      : 'number-pad'
    : props.keyboardType;

  const iosPasswordExtra =
    Platform.OS === 'ios' && showPasswordToggle ? ({ smartInsertDelete: false } as const) : {};

  const passwordFieldLayerStyle = StyleSheet.absoluteFillObject;

  return (
    <View className={cn('w-full gap-1', containerClassName)}>
      {label ? (
        <InputLabel required={required} disabled={resolvedDisabled}>
          {label}
        </InputLabel>
      ) : null}

      <Pressable
        className={wrapperClassName}
        onPress={resolvedDisabled ? undefined : () => inputRef.current?.focus()}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: resolvedDisabled, selected: isFocused }}>
        <InputLeftView>{left ?? leftIcon}</InputLeftView>
        {showPasswordToggle ? (
          <View className={cn('relative flex-1 self-stretch', passwordStackMinHeightClass)}>
            <TextInput
              ref={secureInputRef}
              editable={!resolvedDisabled && isSecure}
              pointerEvents={isSecure ? 'auto' : 'none'}
              placeholderTextColor={props.placeholderTextColor ?? placeholderColor}
              className={inputClassNames}
              style={[
                passwordFieldLayerStyle,
                {
                  opacity: isSecure ? 1 : 0,
                  zIndex: isSecure ? 2 : 0,
                },
              ]}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry
              textContentType={textContentTypeProp ?? 'password'}
              {...props}
              autoCorrect={false}
              spellCheck={false}
              onChangeText={handleChangeText}
              keyboardType={keyboardTypeResolved}
              {...iosPasswordExtra}
            />
            <TextInput
              ref={plainInputRef}
              editable={!resolvedDisabled && !isSecure}
              pointerEvents={isSecure ? 'none' : 'auto'}
              placeholderTextColor={props.placeholderTextColor ?? placeholderColor}
              className={inputClassNames}
              style={[
                passwordFieldLayerStyle,
                {
                  opacity: isSecure ? 0 : 1,
                  zIndex: isSecure ? 0 : 2,
                },
              ]}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={false}
              textContentType={Platform.OS === 'ios' ? 'none' : (textContentTypeProp ?? 'password')}
              {...props}
              autoCorrect={false}
              spellCheck={false}
              onChangeText={handleChangeText}
              keyboardType={keyboardTypeResolved}
              {...iosPasswordExtra}
            />
          </View>
        ) : (
          <TextInput
            ref={inputRef}
            editable={!resolvedDisabled}
            placeholderTextColor={props.placeholderTextColor ?? placeholderColor}
            className={inputClassNames}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isSecure}
            textContentType={textContentTypeProp}
            {...props}
            onChangeText={handleChangeText}
            keyboardType={keyboardTypeResolved}
          />
        )}
        {showPasswordToggle ? (
          <Pressable
            accessibilityLabel={t('ui.toggle_password_visibility')}
            onPress={() => setIsSecure((prev) => !prev)}
            hitSlop={8}>
            <Image
              source={
                isSecure
                  ? require('@/assets/images/eye-icon.svg')
                  : require('@/assets/images/eye-open-icon.svg')
              }
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
          </Pressable>
        ) : null}
        <InputRightView>{right ?? rightIcon}</InputRightView>
      </Pressable>

      {error ? (
        <InputError>{error}</InputError>
      ) : (helper ?? description) ? (
        <Text className="text-[12px] text-muted-foreground">{helper ?? description}</Text>
      ) : null}

      {afterField}
    </View>
  );
});

export { InputError } from './error';
export { InputLabel } from './label';
export { InputLeftView } from './left-view';
export { InputRightView } from './right-view';
export * from './types';
