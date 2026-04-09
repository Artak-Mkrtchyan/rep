import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

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
  React.useImperativeHandle(ref, () => inputRef.current as TextInput);

  const { t } = useTranslation();
  const [isFocused, setIsFocused] = React.useState(false);
  const [isSecure, setIsSecure] = React.useState(!!secureTextEntry);
  const resolvedDisabled = Boolean(isDisabled ?? disabled);
  const hasError = Boolean(isInvalid ?? invalid ?? error);
  const placeholderColor = useThemeValue('placeholder');

  // iOS bug fix: after toggling to secure, iOS internally selects all text.
  // The next edit (Backspace or typing) replaces the entire value instead of editing one char.
  // We detect this and correct the behavior without a visual flash by:
  // 1. Not propagating the bogus empty/replaced value to the parent
  // 2. Forcing a re-render so React reverts the native field to the current props.value
  // 3. Applying the corrected single-char edit on the next frame
  const justToggledToSecure = React.useRef(false);
  const [, forceRender] = React.useState(0);

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
      const filtered = text.replace(new RegExp(`[^${allowDecimal ? '0-9.,' : '0-9'}]`, 'g'), '');
      if (!allowDecimal) return filtered;
      const filteredWithDot = filtered.replace(/,/g, '.');
      const parts = filteredWithDot.split('.');
      if (parts.length <= 2) return filteredWithDot;
      return `${parts[0]}.${parts.slice(1).join('')}`;
    },
    [numericOnly, allowDecimal]
  );

  const handleChangeText = React.useCallback(
    (text: string) => {
      const prev = props.value ?? '';

      // iOS select-all fix: after toggling to secure, if the entire value was replaced
      // in a single edit, iOS selected-all before the keystroke. Correct it.
      // Don't propagate the bogus value — force React to revert native field, then apply fix.
      if (justToggledToSecure.current && prev.length > 1) {
        if (text.length === 0) {
          // Backspace on selected-all → delete only the last character
          justToggledToSecure.current = false;
          forceRender((c) => c + 1); // revert native field to current props.value
          requestAnimationFrame(() => onChangeText?.(prev.slice(0, -1)));
          return;
        }
        if (text.length === 1) {
          // Typed a character over selected-all → append instead of replace
          justToggledToSecure.current = false;
          forceRender((c) => c + 1);
          requestAnimationFrame(() => onChangeText?.(prev + text));
          return;
        }
      }
      justToggledToSecure.current = false;

      const next = numericOnly ? filterNumeric(text) : text;
      onChangeText?.(next);
    },
    [onChangeText, numericOnly, filterNumeric, props.value]
  );

  const handleToggleSecure = React.useCallback(() => {
    setIsSecure((prev) => {
      if (!prev) {
        // Going from plain → secure: set intercept flag
        justToggledToSecure.current = true;
      }
      return !prev;
    });
  }, []);

  const sizeClasses =
    size === 'sm'
      ? 'h-10 rounded-[10px] px-3'
      : size === 'lg'
        ? 'h-14 rounded-[14px] px-4'
        : 'h-12 rounded-[12px] px-3';

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
          autoCorrect={showPasswordToggle ? false : props.autoCorrect}
          spellCheck={showPasswordToggle ? false : props.spellCheck}
          onChangeText={handleChangeText}
          keyboardType={keyboardTypeResolved}
          {...iosPasswordExtra}
        />
        {showPasswordToggle ? (
          <Pressable
            accessibilityLabel={t('ui.toggle_password_visibility')}
            onPress={handleToggleSecure}
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
