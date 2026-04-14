import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';

export type AgentCardProps = {
  name: string;
  company: string;
  rating: string;
  reviewCount: string;
  avatarUri: string;
};

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  company,
  rating,
  reviewCount,
  avatarUri,
}) => {
  return (
    <View
      className="w-full flex-row items-center gap-2 px-4 py-2"
      style={HOME_DESIGN.carouselStripCard}>
      <Image
        source={{ uri: avatarUri }}
        className="h-[62px] w-[62px] rounded-full"
        contentFit="cover"
      />
      <View className="min-w-0 flex-1 justify-center gap-1">
        <ThemedText className="text-[14px] font-semibold leading-[17px] text-foreground" numberOfLines={1}>
          {name}
        </ThemedText>
        <ThemedText className="text-[10px] leading-[11px] text-foreground" numberOfLines={1}>
          {company}
        </ThemedText>
        <View className="mt-0.5 flex-row items-center gap-1">
          <ThemedText className="text-[14px] font-medium text-foreground">{rating}</ThemedText>
          <Ionicons name="star" size={20} color={HOME_DESIGN.green500} />
          <ThemedText className="text-[14px] text-foreground">{reviewCount}</ThemedText>
        </View>
      </View>
    </View>
  );
};
