import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';

import { PriceRangeSlider } from './price-range-slider';

const SLIDER_MIN = 0;
const SLIDER_MAX = 10_000_000;

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
}) => {
  const { t } = useTranslation();

  const sliderMinValue = useMemo(() => {
    const n = Number(priceMin);
    return Number.isFinite(n) && n > 0 ? Math.min(n, SLIDER_MAX) : SLIDER_MIN;
  }, [priceMin]);

  const sliderMaxValue = useMemo(() => {
    const n = Number(priceMax);
    return Number.isFinite(n) && n > 0 ? Math.min(n, SLIDER_MAX) : SLIDER_MAX;
  }, [priceMax]);

  const handleSliderMinChange = useCallback(
    (value: number) => {
      onPriceMinChange(value > 0 ? String(value) : '');
    },
    [onPriceMinChange]
  );

  const handleSliderMaxChange = useCallback(
    (value: number) => {
      onPriceMaxChange(value < SLIDER_MAX ? String(value) : '');
    },
    [onPriceMaxChange]
  );

  return (
    <View className="gap-[12px]">
      <ThemedText className="text-[16px] font-bold text-foreground">
        {t('search.price_range')}
      </ThemedText>

      <PriceRangeSlider
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        minValue={sliderMinValue}
        maxValue={sliderMaxValue}
        onMinChange={handleSliderMinChange}
        onMaxChange={handleSliderMaxChange}
      />

      <View className="mt-[12px] flex-row justify-between">
        <View className="w-[171px]">
          <Input
            label={t('search.price_min')}
            placeholder={t('search.price_no_min')}
            value={priceMin}
            onChangeText={onPriceMinChange}
            numericOnly
            keyboardType="number-pad"
          />
        </View>
        <View className="w-[171px]">
          <Input
            label={t('search.price_max')}
            placeholder={t('search.price_no_max')}
            value={priceMax}
            onChangeText={onPriceMaxChange}
            numericOnly
            keyboardType="number-pad"
          />
        </View>
      </View>
    </View>
  );
};
