import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

const BUTTON_OFFSET = 56; // button height (~40) + 16px gap above sheet

type SaveSearchButtonProps = {
  onPress: () => void;
  sheetTop?: SharedValue<number>;
  /**
   * `showOnMap` — Figma search results CTA (compact, 8px radius).
   * `saveSearch` — legacy map screen action (pill).
   */
  variant?: 'showOnMap' | 'saveSearch';
};

export const SaveSearchButton: React.FC<SaveSearchButtonProps> = ({
  onPress,
  sheetTop,
  variant = 'showOnMap',
}) => {
  const { t } = useTranslation();
  const isSaveSearch = variant === 'saveSearch';
  const label = isSaveSearch
    ? t('search.save_search', 'Save Search')
    : t('search.show_on_map', 'Show on the map');

  const animatedStyle = useAnimatedStyle(() => ({
    top: sheetTop ? sheetTop.value - BUTTON_OFFSET : 0,
  }));

  return (
    <Animated.View style={[positionStyles.container, animatedStyle]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        className={
          isSaveSearch
            ? 'rounded-full bg-[#087443] px-[20px] py-[10px]'
            : 'rounded-[8px] bg-[#087443] px-[14px] py-[7px]'
        }
        style={buttonStyles.button}>
        <ThemedText
          className={
            isSaveSearch
              ? 'text-[15px] font-semibold text-white'
              : 'text-[16px] font-medium text-white'
          }>
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
};

const positionStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    zIndex: 15,
  },
});

const buttonStyles = StyleSheet.create({
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
});
