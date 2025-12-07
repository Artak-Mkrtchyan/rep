import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SignUpCompletedScreen() {
  const handleContinue = () => {
    router.replace('/(auth)/signup/completed');
  };

  return (
    <ThemedView className="flex-1 items-center justify-center px-4">
      <View className="w-[358px] max-w-full items-center gap-6">
        <Image
          style={{ width: 212, height: 135 }}
          source={require('@/assets/images/icon-signup-success.svg')}
          contentFit="contain"
        />
        <ThemedText className="text-center text-[16px]">
          You’ve successfully registered. Welcome aboard!
        </ThemedText>

        <Pressable
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Go to login"
          className="h-[50px] w-full items-center justify-center rounded-[12px] bg-primary"
          style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}>
          <ThemedText className="text-[16px] font-medium text-white">Continue</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}
