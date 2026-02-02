import type React from 'react';
import type { TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  label?: string;
  helper?: string;
  description?: string; // alias for helper (back-compat)
  error?: string;
  isInvalid?: boolean;
  invalid?: boolean; // alias (back-compat)
  required?: boolean;
  isDisabled?: boolean;
  disabled?: boolean; // alias (back-compat)
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost';
  containerClassName?: string;
  inputClassName?: string;
  left?: React.ReactNode; // slot prop
  right?: React.ReactNode; // slot prop
  leftIcon?: React.ReactNode; // alias for left
  rightIcon?: React.ReactNode; // alias for right
  showPasswordToggle?: boolean;
};

export type InputLabelProps = {
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};

export type InputSideProps = {
  children?: React.ReactNode;
};

export type InputErrorProps = {
  children?: React.ReactNode;
};


