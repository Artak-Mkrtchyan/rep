import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
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
  const { announcements, isLoading, error, refetch } = useComparisons();
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
      />
    ),
    [selectedIds, toggleSelection, router]
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
          <ActivityIndicator size="large" color="#13B86D" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <ThemedText className="text-[14px] text-[#777777]">{error}</ThemedText>
        </View>
      ) : announcements.length === 0 ? (
        <View style={styles.center}>
          <ThemedText className="text-[20px] font-semibold text-[#1B1B1B]">
            {t('comparisons.no_result')}
          </ThemedText>
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
          <View style={styles.popup}>
            <ThemedText className="text-[20px] font-semibold leading-[24px] text-[#1B1B1B]">
              {t('comparisons.too_many_title')}
            </ThemedText>
            <ThemedText className="mt-[8px] text-[12px] text-[#777777]">
              {t('comparisons.too_many_message')}
            </ThemedText>
            <Pressable onPress={() => setTooManyVisible(false)} style={styles.closeButton}>
              <ThemedText className="text-[16px] font-semibold text-white">
                {t('comparisons.close')}
              </ThemedText>
            </Pressable>
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
    backgroundColor: '#13B86D',
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginHorizontal: 16,
    width: 358,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: '#13B86D',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
});
