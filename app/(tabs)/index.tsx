import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLogout } from '@/hooks/api/use-auth';

export default function HomeScreen() {
  const { logout, isLoading } = useLogout();

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-main-50">
            <Ionicons name="home" size={40} color="#087443" />
          </View>
          <ThemedText type="title" className="mt-6 text-center">
            Home
          </ThemedText>
          <ThemedText className="mt-2 text-center text-muted-foreground">
            Welcome to Real Estate App
          </ThemedText>

          <Pressable
            onPress={handleSignOut}
            disabled={isLoading}
            className="mt-10 h-12 w-full max-w-xs items-center justify-center rounded-xl border border-neutral-200 bg-white"
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
            accessibilityRole="button"
            accessibilityLabel="Sign out">
            {isLoading ? (
              <ActivityIndicator color="#087443" />
            ) : (
              <View className="flex-row items-center gap-2">
                <Ionicons name="log-out-outline" size={20} color="#d80101" />
                <ThemedText className="text-base font-medium text-red-600">Sign Out</ThemedText>
              </View>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
