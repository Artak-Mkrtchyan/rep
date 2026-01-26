import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { InputError } from '@/components/ui/input/error';
import { InputLabel } from '@/components/ui/input/label';
import { useThemeValue } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export interface NumberPickerProps {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  containerClassName?: string;
}

export const NumberPicker: React.FC<NumberPickerProps> = ({
  label,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  error,
  required,
  containerClassName,
}) => {
  const handleDecrement = () => {
    if (disabled) return;
    const newValue = Math.max(min, value - step);
    onChange?.(newValue);
  };

  const handleIncrement = () => {
    if (disabled) return;
    const newValue = Math.min(max, value + step);
    onChange?.(newValue);
  };

  const isDecrementDisabled = disabled || value <= min;
  const isIncrementDisabled = disabled || value >= max;
  const primaryColor = useThemeValue('primary');
  const mutedColor = useThemeValue('mutedForeground');

  return (
    <View className={cn('w-full gap-1', containerClassName)}>
      {label ? <InputLabel required={required}>{label}</InputLabel> : null}

      <View className="flex-row items-center gap-4">
        {/* Decrement Button */}
        <Pressable
          onPress={handleDecrement}
          disabled={isDecrementDisabled}
          accessibilityRole="button"
          accessibilityLabel="Decrease value"
          accessibilityState={{ disabled: isDecrementDisabled }}
          className={cn(
            'h-8 w-8 items-center justify-center rounded-[6px] border bg-card',
            isDecrementDisabled ? 'border-default opacity-50' : 'border-primary'
          )}
          style={({ pressed }) => (pressed && !isDecrementDisabled ? { opacity: 0.8 } : undefined)}>
          <Ionicons
            name="remove"
            size={16}
            color={isDecrementDisabled ? mutedColor : primaryColor}
          />
        </Pressable>

        {/* Value Display */}
        <View className="items-center justify-center">
          <Text className="text-[14px] font-medium text-foreground">{value}</Text>
        </View>

        {/* Increment Button */}
        <Pressable
          onPress={handleIncrement}
          disabled={isIncrementDisabled}
          accessibilityRole="button"
          accessibilityLabel="Increase value"
          accessibilityState={{ disabled: isIncrementDisabled }}
          className={cn(
            'h-8 w-8 items-center justify-center rounded-[6px] border bg-card',
            isIncrementDisabled ? 'border-default opacity-50' : 'border-primary'
          )}
          style={({ pressed }) => (pressed && !isIncrementDisabled ? { opacity: 0.8 } : undefined)}>
          <Ionicons name="add" size={16} color={isIncrementDisabled ? mutedColor : primaryColor} />
        </Pressable>
      </View>

      {error ? <InputError>{error}</InputError> : null}
    </View>
  );
};
