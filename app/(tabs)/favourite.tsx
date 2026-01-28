import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function FavouriteScreen() {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="heart-outline" size={64} color="#ABABAB" />
          <ThemedText type="title" className="mt-4 text-center">
            Favourite
          </ThemedText>
          <ThemedText className="mt-2 text-center text-muted-foreground">
            Your saved properties will appear here
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
