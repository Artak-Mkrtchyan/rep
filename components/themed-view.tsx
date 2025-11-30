import { View, ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
};

export function ThemedView({ style, className, ...otherProps }: ThemedViewProps) {
  return <View className={cn('bg-background', className)} style={style} {...otherProps} />;
}
