import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

const LABEL_CLASS = 'text-[12px] text-muted-foreground';
const NAME_CLASS = 'text-[14px] font-semibold text-foreground';

export type PlacedByItemProps = {
  name: React.ReactNode | string;
  className?: string;
  icon?: React.ReactNode;
  label: string;
  labelClassName?: string;
  nameClassName?: string;
};

export const PlacedByItem: React.FC<PlacedByItemProps> = ({
  name,
  className,
  icon,
  label,
  labelClassName,
  nameClassName,
}) => (
  <View className={className}>
    <View className="flex-row items-center gap-3">
      {icon}
      <View className="gap-0.5">
        <ThemedText className={cn(LABEL_CLASS, labelClassName)}>{label}</ThemedText>
        {typeof name === 'string' ? (
          <ThemedText className={cn(NAME_CLASS, nameClassName)}>{name}</ThemedText>
        ) : (
          name
        )}
      </View>
    </View>
  </View>
);
