import React from 'react';
import { Text } from 'react-native';

import type { InputLabelProps } from './types';

export const InputLabel = React.memo(function InputLabel({ required, children }: InputLabelProps) {
  if (!children) return null;
  return (
    <Text className="text-[12px] font-bold leading-[11px] text-foreground">
      {children}
      {required ? <Text className="text-destructive"> *</Text> : null}
    </Text>
  );
});
