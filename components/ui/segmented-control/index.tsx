import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

import type { SegmentedControlProps } from './types';

const SEGMENT_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 2,
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedIndex,
  onSelect,
  className,
  accessibilityLabel = 'Segmented control',
}) => (
  <View
    className={cn('h-8 flex-row overflow-hidden rounded-[7px] bg-[#f1f1f1] p-[2px]', className)}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="tablist">
    {segments.map((label, index) => {
      const isSelected = index === selectedIndex;
      return (
        <Pressable
          key={index}
          onPress={() => onSelect(index)}
          className={cn(
            'flex-1 items-center justify-center rounded-[7px] px-2.5 py-[3px]',
            isSelected && 'bg-primary'
          )}
          style={({ pressed }) => [
            isSelected && SEGMENT_SHADOW,
            pressed && !isSelected && { opacity: 0.8 },
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={label}>
          <ThemedText
            className={cn(
              'text-center text-[13px] leading-[18px]',
              isSelected ? 'font-semibold text-white' : 'font-normal text-foreground'
            )}>
            {label}
          </ThemedText>
        </Pressable>
      );
    })}
  </View>
);

export type { SegmentedControlProps } from './types';

export { HorizontalSegmentedControl } from './horizontal-segmented-control';
export type { HorizontalSegmentedControlProps } from './horizontal-types';
