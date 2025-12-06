import React from 'react';
import { Text } from 'react-native';
import type { InputErrorProps } from './types';

export const InputError = React.memo(function InputError({ children }: InputErrorProps) {
  if (!children) return null;
  return <Text className="text-[12px] text-destructive">{children}</Text>;
});


