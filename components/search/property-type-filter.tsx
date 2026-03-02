import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CheckboxRow } from '@/components/ui/checkbox';
import { SEARCH_PROPERTY_TYPES } from '@/constants/search';
import type { PropertyTypeValue } from '@/types/search';

type PropertyTypeFilterProps = {
  selectedTypes: PropertyTypeValue[];
  onToggle: (type: PropertyTypeValue) => void;
};

export const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({
  selectedTypes,
  onToggle,
}) => (
  <View className="gap-1">
    <ThemedText className="text-[16px] font-bold text-foreground">Property type</ThemedText>
    {SEARCH_PROPERTY_TYPES.map((type) => (
      <CheckboxRow
        key={type.value}
        label={type.label}
        checked={selectedTypes.includes(type.value)}
        onToggle={() => onToggle(type.value)}
      />
    ))}
  </View>
);
