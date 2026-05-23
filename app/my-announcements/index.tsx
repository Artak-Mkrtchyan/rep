import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { MyAnnouncementCard } from '@/components/my-announcements';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HorizontalSegmentedControl } from '@/components/ui/segmented-control';
import {
  useGetMyAnnouncementsInfinite,
  useGetMyAnnouncementsStatistics,
} from '@/hooks/api/use-my-announcements';
import {
  AnnouncementStatus,
  ClosureReason,
  type AnnouncementStatisticsByStatusResponse,
} from '@/types/my-announcements';

type FilterLabel = AnnouncementStatus | ClosureReason | 'ALL';

const STATUS_SEGMENTS: { value: string; label: FilterLabel }[] = [
  { value: 'announcement.my.status_all', label: 'ALL' },
  { value: 'announcement.my.status_active', label: AnnouncementStatus.ACTIVE },
  { value: 'announcement.my.closure.given_for_rent', label: ClosureReason.GIVEN_FOR_RENT },
  { value: 'announcement.my.closure.sold_out', label: ClosureReason.SOLD_OUT },
  { value: 'announcement.my.closure.withdrawn', label: ClosureReason.WITHDRAWN_FOR_OTHER_REASONS },
];

const getCountByLabel = (
  label: FilterLabel,
  statistics?: AnnouncementStatisticsByStatusResponse
): number => {
  if (!statistics) return 0;
  if (label === 'ALL') {
    return Object.values(statistics.counterByStatuses ?? {}).reduce((acc, curr) => acc + curr, 0);
  }
  if (Object.values(AnnouncementStatus).includes(label as AnnouncementStatus)) {
    return statistics.counterByStatuses?.[label as AnnouncementStatus] ?? 0;
  }
  return statistics.countersByClosureReasons?.[label as ClosureReason] ?? 0;
};

export default function MyAnnouncementsScreen() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filter =
    selectedIndex === 0
      ? undefined
      : (STATUS_SEGMENTS[selectedIndex].label as AnnouncementStatus | ClosureReason);

  const query = useGetMyAnnouncementsInfinite({ filter, pageSize: 5 });
  const { data: statistics, refetch: refetchStatistics } = useGetMyAnnouncementsStatistics();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const list = useMemo(() => query.data?.pages.flatMap((p) => p.content) ?? [], [query.data]);

  const handleLoadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        query.refetch(),
        refetchStatistics(),
      ]);
    } catch (err) {
      console.error('Failed to refresh announcements:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [query, refetchStatistics]);

  const segments = useMemo(
    () =>
      STATUS_SEGMENTS.map(
        (segment) => `${t(segment.value)}(${getCountByLabel(segment.label, statistics)})`
      ),
    [t, statistics]
  );

  const handleCardPress = (id: string) => {
    router.push({
      pathname: '/announcement/[id]',
      params: { id },
    });
  };

  return (
    <ThemedView className="flex-1">
      {/* Filter chips */}
      <View className="pb-3 pt-4">
        <HorizontalSegmentedControl
          segments={segments}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          accessibilityLabel={t('announcement.title')}
        />
      </View>

      {/* List */}
      <FlatList
        data={list}
        keyExtractor={(row) => row.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, flexGrow: 1 }}
        onEndReached={handleLoadMore}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6">
            <Image
              source={require('@/assets/images/no-application-illustration.svg')}
              style={{ width: 252, height: 168 }}
              contentFit="contain"
            />
            <ThemedText className="mt-4 text-center text-[20px] font-semibold text-neutral-800">
              {t('announcement.my.empty')}
            </ThemedText>
          </View>
        }
        renderItem={({ item: row }) => (
          <MyAnnouncementCard
            item={row}
            onPress={() => handleCardPress(row.id)}
            className="max-w-full"
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}
