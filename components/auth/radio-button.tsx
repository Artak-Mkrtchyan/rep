import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface RadioButtonProps {
  value: string;
  label: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  label,
  selectedValue,
  onSelect,
}) => {
  const isSelected = selectedValue === value;

  return (
    <Pressable
      onPress={() => onSelect(value)}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
      className="flex-row items-center gap-2 rounded-[12px]">
      <View
        className={`h-5 w-5 items-center justify-center rounded-full border ${
          isSelected ? 'border-primary' : 'border-default'
        }`}>
        <View
          className={`h-2.5 w-2.5 rounded-full ${isSelected ? 'bg-primary' : 'bg-transparent'}`}
        />
      </View>
      <ThemedText className="text-[14px]">{label}</ThemedText>
    </Pressable>
  );
};
