import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';

export default function BrokerSelectedScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { horizontalStyle } = useScreenEdgePadding();

  const handleGoToApplications = () => {
    router.dismissAll();
    router.replace('/profile');
    router.push('/applications');
  };

  return (
    <ThemedView className="flex-1">
      <View
        className="flex-row items-center justify-end pt-2"
        style={[horizontalStyle, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={handleGoToApplications}
          className="h-9 w-9 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          hitSlop={8}>
          <Ionicons name="close" size={24} color="#111111" />
        </Pressable>
      </View>

      <View className="flex-1" style={horizontalStyle}>
        <ThemedText className="mt-12 text-center text-[24px] font-bold leading-[32px] text-foreground">
          {t('announcement.rent.broker_selected.title')}
        </ThemedText>

        <ThemedText className="mt-3 text-center text-[14px] leading-[20px] text-neutral-500">
          {t('announcement.rent.broker_selected.subtitle')}
        </ThemedText>

        <View className="mt-8 items-center">
          <Image
            source={require('@/assets/images/broker-selected.svg')}
            style={{ width: 280, height: 200 }}
            contentFit="contain"
            accessibilityLabel={t('announcement.rent.broker_selected.title')}
          />
        </View>
      </View>

      <View
        className="px-4"
        style={{ paddingBottom: Math.max(16, insets.bottom + 12), paddingTop: 12 }}>
        <Button
          onPress={handleGoToApplications}
          accessibilityLabel={t('announcement.rent.broker_selected.cta')}>
          {t('announcement.rent.broker_selected.cta')}
        </Button>
      </View>
    </ThemedView>
  );
}
