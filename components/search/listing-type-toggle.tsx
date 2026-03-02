import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { ListingType } from '@/types/search';

type ListingTypeToggleProps = {
  value: ListingType;
  onChange: (value: ListingType) => void;
};

const OPTIONS: { label: string; value: ListingType }[] = [
  { label: 'Buy', value: 'BUY' },
  { label: 'Rent', value: 'RENT' },
];

export const ListingTypeToggle: React.FC<ListingTypeToggleProps> = ({ value, onChange }) => (
  <View className="flex-row rounded-[10px] bg-secondary p-1">
    {OPTIONS.map((option) => {
      const isActive = value === option.value;
      return (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          className={`flex-1 items-center justify-center rounded-[8px] py-2.5 ${isActive ? 'bg-primary' : ''}`}
          accessibilityRole="button"
          accessibilityState={{ selected: isActive }}>
          <ThemedText
            className={`text-[14px] font-medium ${isActive ? 'text-white' : 'text-foreground'}`}>
            {option.label}
          </ThemedText>
        </Pressable>
      );
    })}
  </View>
);
