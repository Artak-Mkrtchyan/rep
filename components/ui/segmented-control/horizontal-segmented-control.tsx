import { Pressable, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

import type { HorizontalSegmentedControlProps } from '@/components/ui/segmented-control/horizontal-types';

const SEGMENT_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 2,
};

/**
 * Horizontal status filter from Figma (node 6736-98128): white bar, scrollable row,
 * green pill for selected segment, vertical separators between segments.
 */
export const HorizontalSegmentedControl = ({
  segments,
  selectedIndex,
  onSelect,
  className,
  accessibilityLabel = 'Status filter',
}: HorizontalSegmentedControlProps) => (
  <View
    className={cn('overflow-hidden rounded-[7px] bg-white px-4 py-0.5', className)}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="tablist">
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
      {segments.map((label, index) => {
        const isSelected = index === selectedIndex;
        const showSeparatorBefore = index > 0;
        return (
          <View key={index} className="flex-row items-center">
            {showSeparatorBefore ? (
              <View className="mr-0 h-3 w-px shrink-0 bg-foreground/30 opacity-30" />
            ) : null}
            <Pressable
              onPress={() => onSelect(index)}
              className={cn(
                'shrink-0 items-center justify-center rounded-[7px] px-2.5 py-[3px]',
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
                numberOfLines={1}
                className={cn(
                  'text-center text-[13px] leading-[18px]',
                  isSelected ? 'font-semibold text-white' : 'font-normal text-foreground'
                )}>
                {label}
              </ThemedText>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  </View>
);

export type { HorizontalSegmentedControlProps } from '@/components/ui/segmented-control/horizontal-types';
