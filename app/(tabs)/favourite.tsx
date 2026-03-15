import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';

const MOCK_FAVOURITES = [
  {
    id: '1',
    imageSource: require('@/assets/images/hero.png'),
    title: 'White house villa',
    address: '974 Valencia St San Francisco, CA 94110',
    bedsLabel: 'Bed 4',
    bathsLabel: 'Bath 3',
    sizeLabel: '1,442',
    priceLabel: '$ 820,420',
  },
  {
    id: '2',
    imageSource: require('@/assets/images/hero.png'),
    title: 'Modern apartment',
    address: '123 Market St San Francisco, CA 94103',
    bedsLabel: 'Bed 2',
    bathsLabel: 'Bath 2',
    sizeLabel: '980',
    priceLabel: '$ 3,200 / mo',
  },
  {
    id: '3',
    imageSource: require('@/assets/images/hero.png'),
    title: 'White house villa',
    address: '974 Valencia St San Francisco, CA 94110',
    bedsLabel: 'Bed 4',
    bathsLabel: 'Bath 3',
    sizeLabel: '1,442',
    priceLabel: '$ 820,420',
  },
  {
    id: '4',
    imageSource: require('@/assets/images/hero.png'),
    title: 'Modern apartment',
    address: '123 Market St San Francisco, CA 94103',
    bedsLabel: 'Bed 2',
    bathsLabel: 'Bath 2',
    sizeLabel: '980',
    priceLabel: '$ 3,200 / mo',
  },
];

export default function FavouriteScreen() {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        {MOCK_FAVOURITES.length ? (
          <ScrollView className="mt-[47px] flex-1 px-[16px]" showsVerticalScrollIndicator={false}>
            <ThemedText type="title" className="text-[34px]">
              Favourite
            </ThemedText>

            <View className="mt-8 flex-row flex-wrap justify-between">
              {MOCK_FAVOURITES.map((item) => (
                <AnnouncementSmallCard
                  key={item.id}
                  className="mb-[16px] w-[48%]"
                  imageSource={item.imageSource}
                  title={item.title}
                  address={item.address}
                  bedsLabel={item.bedsLabel}
                  bathsLabel={item.bathsLabel}
                  sizeLabel={item.sizeLabel}
                  priceLabel={item.priceLabel}
                  isArrowUpRight={false}
                  isFavourite
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <View className="mt-[47px] flex-1 px-[16px]">
            <ThemedText type="title" className="text-[34px]">
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
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
