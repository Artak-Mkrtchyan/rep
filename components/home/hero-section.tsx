import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

const heroImage = require('@/assets/images/hero.png');

type HeroSectionProps = {
  onMenuPress: () => void;
  onSearchPress: () => void;
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onMenuPress, onSearchPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={heroImage}
      resizeMode="cover"
      style={{ paddingTop: insets.top }}
      className="justify-center">
      <View className="bg-black/30 px-4 pb-8">
        <View className="flex-row items-center justify-between py-3">
          <Pressable
            onPress={onMenuPress}
            className="h-10 w-10 items-center justify-center"
            accessibilityLabel="Open menu"
            accessibilityRole="button">
            <Ionicons name="menu" size={24} color="#ffffff" />
          </Pressable>
          <Pressable
            className="h-10 w-10 items-center justify-center"
            accessibilityLabel="Favorites"
            accessibilityRole="button">
            <Ionicons name="heart-outline" size={24} color="#ffffff" />
          </Pressable>
        </View>

        <ThemedText className="mt-8 text-center text-[28px] font-bold leading-[36px] text-white">
          {'Find your next home\nsweet home'}
        </ThemedText>

        <Pressable
          onPress={onSearchPress}
          className="mt-6 h-12 flex-row items-center rounded-[12px] bg-white/90 px-4"
          accessibilityLabel="Search properties"
          accessibilityRole="button">
          <Ionicons name="search-outline" size={20} color="#ababab" />
          <ThemedText className="ml-3 text-[16px] text-[#ababab]">
            What are you looking for
          </ThemedText>
        </Pressable>
      </View>
    </ImageBackground>
  );
};
