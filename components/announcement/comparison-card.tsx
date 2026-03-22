import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type ComparisonCardProps = {
  imageSource: any;
  title: string;
  address: string;
  bedsLabel: string;
  bathsLabel: string;
  sizeLabel: string;
  priceLabel: string;
  isSelected: boolean;
  onToggleSelect: () => void;
  onPress?: () => void;
};

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  imageSource,
  title,
  address,
  bedsLabel,
  bathsLabel,
  sizeLabel,
  priceLabel,
  isSelected,
  onToggleSelect,
  onPress,
}) => (
  <Pressable onPress={onPress} style={cardStyles.container}>
    <View style={cardStyles.imageContainer}>
      <Image source={imageSource} style={cardStyles.image} contentFit="cover" />
    </View>

    <View style={cardStyles.info}>
      <View className="gap-[4px]">
        <View className="flex-row items-center justify-between">
          <ThemedText
            className="flex-1 text-[14px] font-bold leading-[17px] text-foreground"
            numberOfLines={1}>
            {title}
          </ThemedText>
          <Pressable
            onPress={onToggleSelect}
            style={[cardStyles.checkbox, isSelected && cardStyles.checkboxSelected]}
            hitSlop={8}>
            {isSelected && (
              <ThemedText className="text-[12px] text-white">✓</ThemedText>
            )}
          </Pressable>
        </View>
        <ThemedText className="text-[8px] text-[#777777]" numberOfLines={2}>
          {address}
        </ThemedText>
      </View>

      <View className="flex-row flex-wrap items-center gap-[12px]">
        <View className="flex-row items-center gap-[4px]">
          <Image
            source={require('@/assets/images/announcement-icons/bed-icon.svg')}
            style={cardStyles.icon}
            contentFit="contain"
          />
          <ThemedText className="text-[10px] text-foreground">{bedsLabel}</ThemedText>
        </View>
        <View className="flex-row items-center gap-[4px]">
          <Image
            source={require('@/assets/images/announcement-icons/bath-icon.svg')}
            style={cardStyles.icon}
            contentFit="contain"
          />
          <ThemedText className="text-[10px] text-foreground">{bathsLabel}</ThemedText>
        </View>
        <View className="flex-row items-center gap-[4px]">
          <Image
            source={require('@/assets/images/announcement-icons/size-icon.svg')}
            style={cardStyles.icon}
            contentFit="contain"
          />
          <ThemedText className="text-[10px] text-foreground">{sizeLabel}</ThemedText>
        </View>
      </View>

      <ThemedText className="text-[14px] font-bold leading-[17px] text-foreground">
        {priceLabel}
      </ThemedText>
    </View>
  </Pressable>
);

const cardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    backgroundColor: '#FFFFFF',
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
    elevation: 4,
  },
  imageContainer: {
    width: 126,
    height: 101,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F1F1F1',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: 12,
  },
  icon: {
    width: 12,
    height: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#13B86D',
    borderColor: '#13B86D',
  },
});
