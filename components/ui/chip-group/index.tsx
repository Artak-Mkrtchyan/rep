import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

export type ChipOption<T extends string = string> = {
  label: string;
  value: T;
};

type ChipGroupProps<T extends string = string> = {
  label?: string;
  options: ChipOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
  containerClassName?: string;
};

export function ChipGroup<T extends string = string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  containerClassName,
}: ChipGroupProps<T>) {
  const handlePress = (optionValue: T) => {
    if (disabled) return;
    onChange?.(optionValue);
  };

  return (
    <View className={cn('gap-3', containerClassName)}>
      {label ? (
        <ThemedText className="text-[16px] font-semibold text-foreground">
          {label}
        </ThemedText>
      ) : null}
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => handlePress(option.value)}
              disabled={disabled}
              className={cn(
                'rounded-full px-4 py-2.5',
                selected ? 'bg-primary' : 'bg-white',
                disabled && 'opacity-50'
              )}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected, disabled }}
              style={({ pressed }) =>
                pressed && !disabled ? { opacity: 0.9 } : undefined
              }>
              <ThemedText
                className={cn(
                  'text-[14px]',
                  selected ? 'font-medium text-white' : 'font-normal text-foreground'
                )}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
