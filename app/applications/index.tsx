import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { ApplicationCard } from '@/components/applications';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HorizontalSegmentedControl } from '@/components/ui/segmented-control';
import {
  useGetApplicationStatisticsByStatuses,
  useGetMyApplicationsInfinite,
} from '@/hooks/api/use-applications';
import { ApplicationStatusType } from '@/lib/api/applications';
import { ApplicationStatisticsByStatusResponse } from '@/types/applications';
import { Image } from 'expo-image';
import { router } from 'expo-router';

const STATUS_SEGMENTS: { value: string; label: ApplicationStatusType | 'ALL' }[] = [
  { value: 'applications.status_all', label: 'ALL' },
  { value: 'applications.status_approved', label: 'APPROVED' },
  { value: 'applications.status_under_review', label: 'UNDER_REVIEW' },
  { value: 'applications.status_draft', label: 'DRAFT' },
  { value: 'applications.status_rejected', label: 'REJECTED' },
  { value: 'applications.status_returned', label: 'RETURNED_TO_APPLICANT' },
] as const;

const getCountByStatus = (
  status: ApplicationStatusType | 'ALL',
  statistics?: ApplicationStatisticsByStatusResponse
) => {
  if (status === 'ALL') {
    return (
      Object.values(statistics?.countersByStatuses ?? {}).reduce((acc, curr) => acc + curr, 0) ?? 0
    );
  }
  return statistics?.countersByStatuses[status] ?? 0;
};

export default function ApplicationsScreen() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filter =
    selectedIndex === 0
      ? undefined
      : (STATUS_SEGMENTS[selectedIndex].label as ApplicationStatusType);

  const query = useGetMyApplicationsInfinite({ pageSize: 5, filter });

  const { data: statistics } = useGetApplicationStatisticsByStatuses();

  const list = useMemo(() => query.data?.pages.flatMap((p) => p.content) ?? [], [query.data]);
  const handleLoadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const segments = useMemo(
    () =>
      STATUS_SEGMENTS.map(
        (segment) => `${t(segment.value)} (${getCountByStatus(segment.label, statistics)})`
      ),
    [t, statistics]
  );

  const handleAddBroker = (id: string) => {
    router.push({
      pathname: '/announcement/form/[id]',
      params: { id },
    });
  };

  return (
    <ThemedView className="flex-1 ">
      <View className="pb-4 pt-4">
        <HorizontalSegmentedControl
          segments={segments}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          accessibilityLabel={t('applications.title')}
        />
      </View>

      <FlatList
        data={list}
        keyExtractor={(row) => row.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, flexGrow: 1 }}
        onEndReached={handleLoadMore}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6">
            <Image
              source={require('@/assets/images/no-application-illustration.svg')}
              style={{ width: 252, height: 168 }}
              contentFit="contain"
            />

            <ThemedText className="text-center text-[20px] font-semibold text-neutral-800">
              {t('applications.empty')}
            </ThemedText>
          </View>
        }
        renderItem={({ item: row }) => (
          <ApplicationCard
            item={row}
            onAddBrokerPress={() => handleAddBroker(row.id)}
            className="max-w-full"
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}
