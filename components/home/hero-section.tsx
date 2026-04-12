import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import { ThemedText } from '@/components/themed-text';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';

const heroImage = require('@/assets/images/hero.png');

type HeroSectionProps = {
  onMenuPress: () => void;
  onSearchPress: () => void;
  onNotificationsPress?: () => void;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onMenuPress,
  onSearchPress,
  onNotificationsPress,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { horizontalStyle } = useScreenEdgePadding();

  return (
    <View className="overflow-hidden rounded-b-[24px]">
      <ImageBackground
        source={heroImage}
        resizeMode="cover"
        style={{ paddingTop: insets.top }}
        className="w-full justify-center">
        <View className="pb-8" style={horizontalStyle}>
          <View className="flex-row items-center justify-between py-3">
            <Pressable
              onPress={onMenuPress}
              className="h-10 w-10 items-center justify-center"
              accessibilityLabel={t('home.open_menu')}
              accessibilityRole="button">
              <Ionicons name="menu" size={24} color={HOME_DESIGN.white} />
            </Pressable>
            <Pressable
              onPress={onNotificationsPress}
              disabled={!onNotificationsPress}
              className="h-10 w-10 items-center justify-center"
              accessibilityLabel={t('home.notifications')}
              accessibilityRole="button">
              <Ionicons name="notifications-outline" size={24} color={HOME_DESIGN.white} />
            </Pressable>
          </View>

          <ThemedText className="mt-6 text-center text-[32px] font-bold leading-tight text-white">
            {t('home.hero_title')}
          </ThemedText>

          <Pressable
            onPress={onSearchPress}
            className="mt-6 h-[42px] flex-row items-center rounded-[8px] border border-[#e2e2e2] bg-white px-4"
            accessibilityLabel={t('home.search_properties')}
            accessibilityRole="button">
            <ThemedText
              className="flex-1 text-[12px]"
              style={{ color: HOME_DESIGN.neutral200 }}>
              {t('home.search_placeholder')}
            </ThemedText>
            <Ionicons name="options-outline" size={24} color={HOME_DESIGN.neutral950} />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};
