import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type SectionHeaderRowProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const SectionHeaderRow: React.FC<SectionHeaderRowProps> = ({
  title,
  actionLabel,
  onActionPress,
}) => {
  return (
    <View className="flex-row items-center justify-between">
      <ThemedText className="text-[20px] font-bold leading-6 text-foreground">{title}</ThemedText>
      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <ThemedText className="text-[14px] font-medium text-foreground">{actionLabel}</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
};
