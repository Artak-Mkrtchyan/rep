import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ComparisonIcon } from '@/components/icons/comparison-icon';
import { HeartIcon } from '@/components/icons/heart-icon';
import { ThemedText } from '@/components/themed-text';
import type { CardAttribute } from '@/lib/utils/announcement-helpers';

/** Main/500 — Figma checkbox border + check (Comparisons card). */
const CHECKBOX_MAIN_500 = '#087443';

type ComparisonCardProps = {
  imageSource: any;
  title: string;
  address: string;
  attributes?: CardAttribute[];
  priceLabel: string;
  isSelected: boolean;
  onToggleSelect: () => void;
  onPress?: () => void;
  isFavourite?: boolean;
  /** Items on this screen are in the comparison list; icon shows active (Main/300). */
  isForComparison?: boolean;
  onComparisonPress?: () => void;
  onFavouritePress?: () => void;
};

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  imageSource,
  title,
  address,
  attributes,
  priceLabel,
  isSelected,
  onToggleSelect,
  onPress,
  isFavourite = false,
  isForComparison = true,
  onComparisonPress,
  onFavouritePress,
}) => {
  const showImageActions = onComparisonPress != null && onFavouritePress != null;
  const heartBg = isFavourite ? 'bg-[#11111199]' : 'bg-[#1111114d]';

  return (
  <Pressable onPress={onPress} style={cardStyles.container}>
    <View style={cardStyles.imageContainer}>
      <Image source={imageSource} style={cardStyles.image} contentFit="cover" />
      {showImageActions && (
        <View className="absolute right-2 top-2 flex-row items-center gap-2" pointerEvents="box-none">
          <Pressable
            onPress={onComparisonPress}
            className={`h-6 w-6 items-center justify-center rounded-[36px] ${
              isForComparison ? 'bg-[#11111199]' : 'bg-[#1111114d]'
            }`}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Comparison">
            <ComparisonIcon
              width={20}
              height={20}
              stroke={isForComparison ? '#13B86D' : 'white'}
              fill={isForComparison ? '#13B86D' : 'white'}
            />
          </Pressable>
          <Pressable
            onPress={onFavouritePress}
            className={`h-6 w-6 items-center justify-center rounded-[36px] ${heartBg}`}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Favourite">
            <HeartIcon
              width={16}
              height={16}
              stroke={isFavourite ? '#13B86D' : 'white'}
              fill={isFavourite ? '#13B86D' : 'none'}
            />
          </Pressable>
        </View>
      )}
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
            hitSlop={8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}>
            {isSelected && (
              <Ionicons name="checkmark" size={16} color={CHECKBOX_MAIN_500} />
            )}
          </Pressable>
        </View>
        <ThemedText className="text-[8px] text-[#777777]" numberOfLines={2}>
          {address}
        </ThemedText>
      </View>

      <View className="flex-row flex-wrap items-center gap-[12px]">
        {attributes
          ?.filter((attr) => attr.label !== '')
          .map((attr, index) => (
            <View key={index} className="flex-row items-center gap-[4px]">
              <Image source={attr.icon} style={cardStyles.icon} contentFit="contain" />
              <ThemedText className="text-[10px] text-foreground">{attr.label}</ThemedText>
            </View>
          ))}
      </View>

      <ThemedText className="text-[14px] font-bold leading-[17px] text-foreground">
        {priceLabel}
      </ThemedText>
    </View>
  </Pressable>
  );
};

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
  /** Figma: 24×24 control (was 20 — read small vs design). */
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Figma: white fill + Main/500 stroke; green checkmark (not solid green box). */
  checkboxSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: CHECKBOX_MAIN_500,
  },
});
