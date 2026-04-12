import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';

export type ConstructionCompanyCardProps = {
  name: string;
  rating: string;
  logoUri: string;
};

export const ConstructionCompanyCard: React.FC<ConstructionCompanyCardProps> = ({
  name,
  rating,
  logoUri,
}) => {
  return (
    <View
      className="w-full flex-row items-center gap-2 px-4 py-2"
      style={HOME_DESIGN.carouselStripCard}>
      <View className="h-[62px] w-[62px] overflow-hidden rounded-xl bg-white">
        <Image source={{ uri: logoUri }} className="h-full w-full" contentFit="cover" />
      </View>
      <View className="min-w-0 flex-1 justify-center gap-1">
        <ThemedText className="text-[14px] font-semibold leading-[17px] text-foreground" numberOfLines={2}>
          {name}
        </ThemedText>
        <View className="flex-row items-center gap-1">
          <ThemedText className="text-[14px] text-foreground">{rating}</ThemedText>
          <Ionicons name="star" size={20} color={HOME_DESIGN.green500} />
        </View>
      </View>
    </View>
  );
};
