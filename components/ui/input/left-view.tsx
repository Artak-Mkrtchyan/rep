import React from 'react';
import { View } from 'react-native';
import type { InputSideProps } from './types';

export const InputLeftView = React.memo(function InputLeftView({ children }: InputSideProps) {
  if (!children) return null;
  return <View className="mr-2">{children}</View>;
});


