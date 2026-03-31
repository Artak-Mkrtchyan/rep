import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CARD_WIDTH,
  ComparisonDetailCard,
} from '@/components/announcement/comparison-detail-card';
import { ThemedText } from '@/components/themed-text';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { announcementsService } from '@/lib/api/announcements';
import type { Announcement } from '@/types/api';

const CARD_GAP = 8;

export default function ComparisonDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { horizontalStyle } = useScreenEdgePadding();
  const { ids } = useLocalSearchParams<{ ids: string }>();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      if (!ids) return;
      setIsLoading(true);
      setError(null);
      try {
        const idList = ids.split(',');
        const results = await Promise.all(
          idList.map((id) => announcementsService.getAnnouncementById(id))
        );
        if (mountedRef.current) setAnnouncements(results);
      } catch (err) {
        if (mountedRef.current)
          setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    })();
    return () => {
      mountedRef.current = false;
    };
  }, [ids]);

  const renderItem = useCallback(
    ({ item }: { item: Announcement }) => <ComparisonDetailCard announcement={item} />,
    []
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
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          horizontal
          pagingEnabled={false}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.list, horizontalStyle]}
        />
      )}
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
    gap: CARD_GAP,
    paddingBottom: 24,
  },
});
