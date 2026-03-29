import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';

const heroImage = require('@/assets/images/hero.png');

type HeroSectionProps = {
  onMenuPress: () => void;
  onSearchPress: () => void;
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onMenuPress, onSearchPress }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { horizontalStyle } = useScreenEdgePadding();

  return (
    <ImageBackground
      source={heroImage}
      resizeMode="cover"
      style={{ paddingTop: insets.top }}
      className="justify-center">
      <View className="pb-8" style={horizontalStyle}>
        <View className="flex-row items-center justify-between py-3">
          <Pressable
            onPress={onMenuPress}
            className="h-10 w-10 items-center justify-center"
            accessibilityLabel={t('home.open_menu')}
            accessibilityRole="button">
            <Ionicons name="menu" size={24} color="#ffffff" />
          </Pressable>
          <Pressable
            className="h-10 w-10 items-center justify-center"
            accessibilityLabel={t('home.favorites')}
            accessibilityRole="button">
            <Ionicons name="heart-outline" size={24} color="#ffffff" />
          </Pressable>
        </View>

        <ThemedText className="mt-8 text-center text-[28px] font-bold leading-[36px] text-white">
          {t('home.hero_title')}
        </ThemedText>

        <Pressable
          onPress={onSearchPress}
          className="mt-6 h-12 flex-row items-center rounded-[12px] bg-white/90 px-4"
          accessibilityLabel={t('home.search_properties')}
          accessibilityRole="button">
          <Ionicons name="search-outline" size={20} color="#ababab" />
          <ThemedText className="ml-3 text-[16px] text-[#ababab]">
            {t('home.search_placeholder')}
          </ThemedText>
        </Pressable>
      </View>
    </ImageBackground>
  );
};
