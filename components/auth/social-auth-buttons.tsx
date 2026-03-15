import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface SocialAuthButtonsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGooglePress,
  onApplePress,
}) => {
  const { t } = useTranslation();

  return (
    <View className="w-full flex-row gap-4">
      <Pressable
        onPress={onGooglePress}
        className="h-12 flex-1 justify-center rounded-[12px] border border-secondary bg-card px-4"
        style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
        accessibilityRole="button"
        accessibilityLabel={t('auth.continue_with_google')}>
        <View className="flex-row items-center justify-center gap-2">
          <Image
            source={require('@/assets/images/google-icon.svg')}
            style={{ width: 24, height: 24 }}
            contentFit="contain"
          />
          <ThemedText>{t('auth.google')}</ThemedText>
        </View>
      </Pressable>

      <Pressable
        onPress={onApplePress}
        className="h-12 flex-1 justify-center rounded-[12px] border border-secondary bg-card px-4"
        style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
        accessibilityRole="button"
        accessibilityLabel={t('auth.continue_with_apple')}>
        <View className="flex-row items-center justify-center gap-2">
          <Image
            source={require('@/assets/images/apple-icon.svg')}
            style={{ width: 24, height: 24 }}
            contentFit="contain"
          />
          <ThemedText>{t('auth.apple')}</ThemedText>
        </View>
      </Pressable>
    </View>
  );
};
