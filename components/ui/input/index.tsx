import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useThemeValue } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { InputError } from './error';
import { InputLabel } from './label';
import { InputLeftView } from './left-view';
import { InputRightView } from './right-view';

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
    onFocus,
    onBlur,
    ...props
  }: InputProps,
  ref: React.Ref<TextInput>
) {
  const inputRef = React.useRef<TextInput>(null);
  React.useImperativeHandle(ref, () => inputRef.current as TextInput);

  const [isFocused, setIsFocused] = React.useState(false);
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

  const sizeClasses =
    size === 'sm'
      ? 'h-10 rounded-[10px] px-3'
      : size === 'lg'
        ? 'h-14 rounded-[14px] px-4'
        : 'h-12 rounded-[12px] px-3';

  const variantClasses = variant === 'ghost' ? 'bg-transparent' : 'bg-card';

  const wrapperClassName = cn(
    'flex-row items-center border',
    sizeClasses,
    variantClasses,
    resolvedDisabled && 'opacity-50',
    hasError ? 'border-destructive' : isFocused ? 'border-primary' : 'border-default'
  );

  return (
    <View className={cn('w-full gap-1', containerClassName)}>
      {label ? <InputLabel required={required}>{label}</InputLabel> : null}

      <Pressable
        className={wrapperClassName}
        onPress={() => inputRef.current?.focus()}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: resolvedDisabled, selected: isFocused }}>
        <InputLeftView>{left ?? leftIcon}</InputLeftView>
        <TextInput
          ref={inputRef}
          editable={!resolvedDisabled}
          placeholderTextColor={props.placeholderTextColor ?? placeholderColor}
          className={cn(
            'h-full flex-1 text-[16px] text-foreground placeholder:text-muted-foreground',
            inputClassName
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {showPasswordToggle && props.secureTextEntry ? (
          <Pressable
            accessibilityLabel="Toggle password visibility"
            onPress={() => {
              if (inputRef.current) inputRef.current.focus();
            }}>
            <Text className="ml-2 text-muted-foreground">•••</Text>
          </Pressable>
        ) : null}
        <InputRightView>{right ?? rightIcon}</InputRightView>
      </Pressable>

      {error ? (
        <InputError>{error}</InputError>
      ) : (helper ?? description) ? (
        <Text className="text-[12px] text-muted-foreground">{helper ?? description}</Text>
      ) : null}
    </View>
  );
});

export { InputError } from './error';
export { InputLabel } from './label';
export { InputLeftView } from './left-view';
export { InputRightView } from './right-view';
export * from './types';
