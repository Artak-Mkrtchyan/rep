import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';

export default function AnnouncementScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();

  const handleAddPress = () => {
    router.push('/announcement/form/new');
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center" style={horizontalStyle}>
          <Pressable
            onPress={handleAddPress}
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
            accessibilityRole="button"
            accessibilityLabel={t('announcement.create')}>
            <Ionicons name="add-circle-outline" size={64} color="#ABABAB" />
          </Pressable>
          <ThemedText type="title" className="mt-4 text-center">
            {t('announcement.title')}
          </ThemedText>
          <ThemedText className="mt-2 text-center text-muted-foreground">
            {t('announcement.subtitle')}
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
