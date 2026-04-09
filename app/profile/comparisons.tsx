import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ComparisonCard } from '@/components/announcement/comparison-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useComparisons } from '@/hooks/api/use-comparisons';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import {
  getAddress,
  getCardAttributes,
  getImageSource,
  getPriceLabel,
} from '@/lib/utils/announcement-helpers';

import { styles } from './comparisons.styles';

const MIN_COMPARE_COUNT = 2;
const MAX_COMPARE_COUNT = 3;

export default function ComparisonsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { announcements, isLoading, error, refetch, removeFromComparison, toggleFavourite } =
    useComparisons();
  const { horizontalStyle } = useScreenEdgePadding();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tooManyVisible, setTooManyVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
      setSelectedIds(new Set());
    }, [refetch])
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const hasEnoughSelected = selectedIds.size >= MIN_COMPARE_COUNT;

  const handleCompare = useCallback(() => {
    if (selectedIds.size < MIN_COMPARE_COUNT || selectedIds.size > MAX_COMPARE_COUNT) {
      setTooManyVisible(true);
      return;
    }
    const idsParam = Array.from(selectedIds).join(',');
    router.push(`/profile/comparison-details?ids=${idsParam}` as any);
  }, [selectedIds, router]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof announcements)[0] }) => (
      <ComparisonCard
        imageSource={getImageSource(item)}
        title={item.title}
        address={getAddress(item)}
        attributes={getCardAttributes(item)}
        priceLabel={getPriceLabel(item)}
        isSelected={selectedIds.has(item.id)}
        onToggleSelect={() => toggleSelection(item.id)}
        onPress={() => router.push(`/announcement/${item.id}` as any)}
        isFavourite={item.favourite}
        isForComparison
        onComparisonPress={() => removeFromComparison(item.id)}
        onFavouritePress={() => toggleFavourite(item.id, item.favourite)}
      />
    ),
    [selectedIds, toggleSelection, router, removeFromComparison, toggleFavourite]
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#087443" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <ThemedText className="text-[14px] text-neutral-400">{error}</ThemedText>
        </View>
      );
    }

    if (announcements.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateInner}>
            <Image
              source={require('@/assets/images/no-result-illustration.svg')}
              style={styles.emptyIllustration}
              contentFit="contain"
            />
            <ThemedText className="mt-4 text-center text-[24px] font-semibold leading-normal text-foreground">
              {t('comparisons.no_result')}
            </ThemedText>
          </View>
        </View>
      );
    }

    return (
      <FlatList
        data={announcements}
        keyExtractor={extractId}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, horizontalStyle]}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <ThemedView className="flex-1 bg-white">
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.header, horizontalStyle]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#111111" />
          </Pressable>
          <ThemedText className="text-[20px] font-semibold leading-[24px] text-foreground">
            {t('comparisons.title')}
          </ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        {renderContent()}

        <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
          <Pressable
            onPress={handleCompare}
            disabled={!hasEnoughSelected}
            style={[styles.compareButton, !hasEnoughSelected && styles.compareButtonDisabled]}>
            <ThemedText
              className={`text-[16px] font-semibold ${hasEnoughSelected ? 'text-white' : 'text-neutral-400'}`}>
              {t('comparisons.compare')}
            </ThemedText>
          </Pressable>
        </SafeAreaView>

        <Modal
          visible={tooManyVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTooManyVisible(false)}>
          <View style={styles.overlay}>
            <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.overlayDim} pointerEvents="none" />
            <View style={styles.popup}>
              <View style={styles.popupTextBlock}>
                <ThemedText className="text-center text-[20px] font-bold leading-[24px] text-foreground">
                  {t('comparisons.too_many_title')}
                </ThemedText>
                <ThemedText className="mt-2 text-center text-[12px] leading-normal text-neutral-500">
                  {t('comparisons.too_many_message')}
                </ThemedText>
              </View>
              <View style={styles.popupLower}>
                <Image
                  source={require('@/assets/images/too-many-items.svg')}
                  style={styles.tooManyIllustration}
                  contentFit="contain"
                  accessibilityIgnoresInvertColors
                />
                <Pressable onPress={() => setTooManyVisible(false)} style={styles.closeButton}>
                  <ThemedText className="text-[16px] font-semibold text-white">
                    {t('comparisons.close')}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

const extractId = (item: { id: string }) => item.id;
