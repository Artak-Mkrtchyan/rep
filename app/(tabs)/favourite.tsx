import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function FavouriteScreen() {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1 px-4">
          <ThemedText type="title" className="mt-[47px] text-[34px]">
            Favourite
          </ThemedText>

          <View className="flex-1 items-center justify-center">
            <View className="aspect-square w-full max-w-[280px] items-center justify-center">
              <Image
                source={require('@/assets/images/no-result-illustration.svg')}
                style={{ width: 250, height: 154 }}
                contentFit="contain"
              />
              <ThemedText className="mt-4 text-center text-[24px] font-semibold text-foreground">
                No result
              </ThemedText>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
