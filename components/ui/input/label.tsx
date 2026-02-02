import React from 'react';
import { Text, View } from 'react-native';

import { cn } from '@/lib/utils';
import { Image } from 'expo-image';
import type { InputLabelProps } from './types';

export const InputLabel = React.memo(function InputLabel({
  required,
  disabled,
  children,
}: InputLabelProps) {
  if (!children) return null;
  return (
    <View className="flex-row" style={{ gap: 5 }}>
      <Text
        className={cn(
          'text-[12px] font-bold leading-[11px]',
          disabled ? 'text-muted-foreground' : 'text-foreground'
        )}>
        {children}
      </Text>
      {required ? (
        <Image
          source={require('@/assets/images/star.svg')}
          style={{ width: 8, height: 8 }}
          contentFit="contain"
        />
      ) : null}
    </View>
  );
});
