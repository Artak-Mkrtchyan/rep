import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { cn } from '@/lib/utils';
import { ThemedText } from '../themed-text';

const CARD_SHADOW: ViewStyle = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

export type AnnouncementCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  title?: string;
};

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  children,
  className,
  style,
  title,
}) => (
  <View className={cn('rounded-[12px] bg-card p-4', className)} style={[CARD_SHADOW, style]}>
    {title != null ? (
      <ThemedText className="mb-3 text-[16px] font-semibold text-foreground">
        {title}
      </ThemedText>
    ) : null}
    {children}
  </View>
);
