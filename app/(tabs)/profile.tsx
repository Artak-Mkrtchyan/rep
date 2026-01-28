import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-main-50">
            <Ionicons name="person" size={40} color="#087443" />
          </View>
          <ThemedText type="title" className="mt-6 text-center">
            Profile
          </ThemedText>
          <ThemedText className="mt-2 text-center text-muted-foreground">
            Manage your account settings
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
