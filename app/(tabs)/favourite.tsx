import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFavourites } from '@/hooks/api/use-favourites';
import { seedAll } from '@/lib/dev/create-announcements';
import {
  getAddress,
  getBathsLabel,
  getBedsLabel,
  getImageSource,
  getPriceLabel,
  getSizeLabel,
} from '@/lib/utils/announcement-helpers';
import { Image } from 'expo-image';

export default function FavouriteScreen() {
  const { t } = useTranslation();
  const { favourites, isLoading, error, refetch, toggle } = useFavourites();
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedAll();
      await refetch();
    } finally {
      setSeeding(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1">
        <SafeAreaView className="flex-1 items-center justify-center" edges={['top']}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView className="flex-1">
        <SafeAreaView className="flex-1 items-center justify-center px-4" edges={['top']}>
          <ThemedText className="mb-4 text-center text-foreground">{error}</ThemedText>
          <Pressable onPress={refetch} className="rounded-lg bg-main-500 px-6 py-3">
            <ThemedText className="font-semibold text-white">{t('common.retry')}</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        {favourites.length ? (
          <ScrollView className="mt-[47px] flex-1 px-[16px]" showsVerticalScrollIndicator={false}>
            <ThemedText type="title" className="text-[34px]">
              {t('favourite.title')}
            </ThemedText>

            <View className="mt-8 flex-row flex-wrap justify-between">
              {favourites.map((item) => (
                <AnnouncementSmallCard
                  key={item.id}
                  className="mb-[16px] w-[48%]"
                  imageSource={getImageSource(item)}
                  title={item.title}
                  address={getAddress(item)}
                  bedsLabel={getBedsLabel(item)}
                  bathsLabel={getBathsLabel(item)}
                  sizeLabel={getSizeLabel(item)}
                  priceLabel={getPriceLabel(item)}
                  isArrowUpRight={false}
                  isFavourite
                  onFavouritePress={() => toggle(item.id, true)}
                />
              ))}
            </View>

            {__DEV__ && (
              <Pressable
                onPress={handleSeed}
                disabled={seeding}
                className="mb-8 items-center rounded-lg border border-dashed border-muted-foreground py-3">
                <ThemedText className="text-sm text-muted-foreground">
                  {seeding ? t('favourite.seeding') : t('favourite.seed_test_data')}
                </ThemedText>
              </Pressable>
            )}
          </ScrollView>
        ) : (
          <View className="mt-[47px] flex-1 px-[16px]">
            <ThemedText type="title" className="text-[34px]">
              {t('favourite.title')}
            </ThemedText>
            <View className="flex-1 items-center justify-center">
              <View className="mb-20 aspect-square w-full max-w-[280px] items-center justify-center">
                <Image
                  source={require('@/assets/images/no-result-illustration.svg')}
                  style={{ width: 250, height: 154 }}
                  contentFit="contain"
                />
                <ThemedText className="mt-4 text-center text-[24px] font-semibold text-foreground">
                  {t('favourite.no_result')}
                </ThemedText>
                {__DEV__ && (
                  <Pressable
                    onPress={handleSeed}
                    disabled={seeding}
                    className="mt-6 rounded-lg bg-main-500 px-6 py-3">
                    <ThemedText className="font-semibold text-white">
                      {seeding ? t('favourite.seeding') : t('favourite.seed_test_data')}
                    </ThemedText>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
