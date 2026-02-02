import React from 'react';
import { Text } from 'react-native';

import { cn } from '@/lib/utils';
import type { InputLabelProps } from './types';

export const InputLabel = React.memo(function InputLabel({
  required,
  disabled,
  children,
}: InputLabelProps) {
  if (!children) return null;
  return (
    <Text
      className={cn(
        'text-[12px] font-bold leading-[11px]',
        disabled ? 'text-muted-foreground' : 'text-foreground'
      )}>
      {children}
      {required ? <Text className="text-destructive"> *</Text> : null}
    </Text>
  );
});
