import React from 'react';
import { View } from 'react-native';

import type { InputSideProps } from './types';

export const InputRightView = React.memo(function InputRightView({ children }: InputSideProps) {
  if (!children) return null;
  return <View className="ml-2">{children}</View>;
});
