import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';

export default function AnnouncementScreen() {
  const handleAddPress = () => {
    router.push(ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path);
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-4">
          <Pressable
            onPress={handleAddPress}
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
            accessibilityRole="button"
            accessibilityLabel="Create announcement">
            <Ionicons name="add-circle-outline" size={64} color="#ABABAB" />
          </Pressable>
          <ThemedText type="title" className="mt-4 text-center">
            Announcement
          </ThemedText>
          <ThemedText className="mt-2 text-center text-muted-foreground">
            Create and manage your property listings
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
