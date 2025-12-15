import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'border border-secondary bg-card',
  ghost: 'bg-transparent',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  default: 'h-[50px]',
  sm: 'h-10',
  lg: 'h-12',
};

const TEXT_SIZE_STYLES: Record<ButtonSize, string> = {
  default: 'text-[16px]',
  sm: 'text-[14px]',
  lg: 'text-[16px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  children,
  disabled,
  fullWidth = true,
  style,
  ...props
}) => {
  const baseStyles = 'items-center justify-center rounded-[12px]';
  const variantStyles = disabled && variant === 'primary' ? 'bg-input' : VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];
  const widthStyles = fullWidth ? 'w-full' : '';

  const className = `${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyles}`.trim();

  return (
    <Pressable
      disabled={disabled}
      className={className}
      style={[({ pressed }) => (pressed && !disabled ? { opacity: 0.9 } : undefined), style]}
      {...props}>
      {typeof children === 'string' ? (
        <ThemedText
          className={`${TEXT_SIZE_STYLES[size]} font-medium ${variant === 'primary' ? 'text-white' : ''}`}>
          {children}
        </ThemedText>
      ) : (
        children
      )}
    </Pressable>
  );
};
