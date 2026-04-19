import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type LayoutChangeEvent, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { styles } from '@/app/search/results.styles';

type SearchResultsHeaderProps = {
  query: string;
  address?: string;
  onBack: () => void;
  onOpenFilters: () => void;
  onClearQuery: () => void;
  onHeightMeasured?: (height: number) => void;
};

export const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  query,
  address,
  onBack,
  onOpenFilters,
  onClearQuery,
  onHeightMeasured,
}) => {
  const { t } = useTranslation();

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      onHeightMeasured?.(e.nativeEvent.layout.height);
    },
    [onHeightMeasured]
  );

  return (
    <SafeAreaView
      className="absolute left-0 right-0 top-0 z-10"
      edges={['top']}
      onLayout={handleLayout}>
      <View className="flex-row items-center gap-[8px] px-[16px] pt-[16px]">
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.go_back')}
          className="h-[46px] w-[46px] items-center justify-center rounded-full bg-white"
          style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </Pressable>

        <Pressable
          onPress={onOpenFilters}
          className="h-[46px] flex-1 flex-row items-center gap-[8px] rounded-full bg-white px-[16px]"
          style={styles.headerButton}>
          <Ionicons name="search-outline" size={20} color="#ABABAB" />
          <ThemedText className="flex-1 text-[17px] text-foreground" numberOfLines={1}>
            {address || query || t('search.title')}
          </ThemedText>
          {(address || query) ? (
            <Pressable
              onPress={onClearQuery}
              className="h-[24px] w-[24px] items-center justify-center rounded-full bg-[#E2E2E2]">
              <Ionicons name="close" size={14} color="#777777" />
            </Pressable>
          ) : null}
        </Pressable>

        <Pressable
          onPress={onOpenFilters}
          accessibilityRole="button"
          accessibilityLabel={t('search.title')}
          className="h-[46px] w-[46px] items-center justify-center rounded-full bg-white"
          style={styles.headerButton}>
          <Ionicons name="options-outline" size={20} color="#111111" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
