import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ComparisonCard } from '@/components/announcement/comparison-card';
import { ThemedText } from '@/components/themed-text';
import { useComparisons } from '@/hooks/api/use-comparisons';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import {
  getAddress,
  getCardAttributes,
  getImageSource,
  getPriceLabel,
} from '@/lib/utils/announcement-helpers';

export default function ComparisonsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { announcements, isLoading, error, refetch, removeFromComparison, toggleFavourite } =
    useComparisons();
  const { horizontalStyle } = useScreenEdgePadding();
  const insets = useSafeAreaInsets();
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

  const handleCompare = useCallback(() => {
    if (selectedIds.size < 2 || selectedIds.size > 3) {
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={[styles.header, horizontalStyle]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </Pressable>
        <ThemedText className="text-[20px] font-semibold leading-[24px] text-[#1B1B1B]">
          {t('comparisons.title')}
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#087443" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <ThemedText className="text-[14px] text-[#777777]">{error}</ThemedText>
        </View>
      ) : announcements.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateInner}>
            <Image
              source={require('@/assets/images/no-result-illustration.svg')}
              style={styles.emptyIllustration}
              contentFit="contain"
            />
            <ThemedText className="mt-4 text-center text-[24px] font-semibold leading-normal text-[#111111]">
              {t('comparisons.no_result')}
            </ThemedText>
          </View>
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.list, horizontalStyle]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {announcements.length > 0 && (
        <SafeAreaView
          edges={['bottom']}
          style={[
            styles.bottomBar,
            {
              paddingLeft: 10 + insets.left,
              paddingRight: 10 + insets.right,
            },
          ]}>
          <Pressable
            onPress={handleCompare}
            style={[styles.compareButton, selectedIds.size < 2 && styles.compareButtonDisabled]}>
            <ThemedText className="text-[16px] font-semibold text-white">
              {t('comparisons.compare')}
            </ThemedText>
          </Pressable>
        </SafeAreaView>
      )}

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
              <ThemedText className="text-center text-[20px] font-bold leading-[24px] text-[#111111]">
                {t('comparisons.too_many_title')}
              </ThemedText>
              <ThemedText className="mt-2 text-center text-[12px] leading-normal text-[#5E5E5E]">
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
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyStateInner: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 280,
    width: '100%',
  },
  emptyIllustration: {
    width: 250,
    height: 154,
  },
  list: {
    gap: 12,
    paddingBottom: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  compareButton: {
    backgroundColor: '#087443',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareButtonDisabled: {
    opacity: 0.5,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginHorizontal: 16,
    width: 358,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#6E6E6E',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 33,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  popupTextBlock: {
    alignItems: 'center',
    width: '100%',
  },
  popupLower: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
    gap: 32,
  },
  tooManyIllustration: {
    width: 214,
    height: 143,
  },
  closeButton: {
    backgroundColor: '#0E9457',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
});
