import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

export type CheckboxRowProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  containerClassName?: string;
};

export const CheckboxRow: React.FC<CheckboxRowProps> = ({
  label,
  checked,
  onToggle,
  disabled = false,
  containerClassName,
}) => (
  <Pressable
    onPress={onToggle}
    disabled={disabled}
    className={cn('flex-row items-center gap-3 py-2', containerClassName)}
    accessibilityRole="checkbox"
    accessibilityState={{ checked, disabled }}
    accessibilityLabel={label}
    style={({ pressed }) => (pressed && !disabled ? { opacity: 0.8 } : undefined)}>
    <View
      className={cn(
        'h-5 w-5 items-center justify-center rounded-[4px] border-2',
        checked ? 'border-primary bg-primary' : 'border-default bg-card',
        disabled && 'opacity-50'
      )}>
      {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
    </View>
    <ThemedText className="flex-1 text-[14px] text-foreground">{label}</ThemedText>
  </Pressable>
);
