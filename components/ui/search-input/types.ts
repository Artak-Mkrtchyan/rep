import type { TextInputProps } from 'react-native';

export type SearchInputProps = Omit<
  TextInputProps,
  'placeholderTextColor' | 'style' | 'className'
> & {
  placeholder?: string;
  containerClassName?: string;
  inputClassName?: string;
  placeholderColor?: string;
  iconColor?: string;
  iconSize?: number;
};
