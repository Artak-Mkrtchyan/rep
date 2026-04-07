import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

const BUTTON_OFFSET = 56; // button height (~40) + 16px gap above sheet

type SaveSearchButtonProps = {
  onPress: () => void;
  sheetTop?: SharedValue<number>;
};

export const SaveSearchButton: React.FC<SaveSearchButtonProps> = ({ onPress, sheetTop }) => {
  const { t } = useTranslation();

  const animatedStyle = useAnimatedStyle(() => ({
    top: sheetTop ? sheetTop.value - BUTTON_OFFSET : 0,
  }));

  return (
    <Animated.View style={[positionStyles.container, animatedStyle]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        className="rounded-full bg-[#087443] px-[20px] py-[10px]"
        style={buttonStyles.button}>
        <ThemedText className="text-[15px] font-semibold text-white">
          {t('search.save_search', 'Save Search')}
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
