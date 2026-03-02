import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';

type PriceRangeFilterProps = {
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
};

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
}) => (
  <View className="gap-3">
    <ThemedText className="text-[16px] font-bold text-foreground">Price range</ThemedText>
    <View className="flex-row gap-4">
      <View className="flex-1">
        <Input
          label="Min"
          placeholder="No min"
          value={priceMin}
          onChangeText={onPriceMinChange}
          numericOnly
          keyboardType="number-pad"
        />
      </View>
      <View className="flex-1">
        <Input
          label="Max"
          placeholder="No max"
          value={priceMax}
          onChangeText={onPriceMaxChange}
          numericOnly
          keyboardType="number-pad"
        />
      </View>
    </View>
  </View>
);
