import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, View } from 'react-native';

import { ApplicationCard, AssignBrokerModal } from '@/components/applications';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HorizontalSegmentedControl } from '@/components/ui/segmented-control';
import { useAuth } from '@/context/AuthContext';
import {
  useDeleteApplication,
  useGetApplicationStatisticsByStatuses,
  useGetMyApplicationsInfinite,
} from '@/hooks/api/use-applications';
import { ApplicationStatusType } from '@/lib/api/applications';
import { ApplicationStatisticsByStatusResponse } from '@/types/applications';
import { Image } from 'expo-image';
import { router } from 'expo-router';

const STATUS_SEGMENTS: { value: string; label: ApplicationStatusType | 'ALL' }[] = [
  { value: 'applications.status_all', label: 'ALL' },
  { value: 'applications.status_draft', label: 'DRAFT' },
  { value: 'applications.status_submitted', label: 'SUBMITTED' },
  { value: 'applications.status_under_review', label: 'UNDER_REVIEW' },
  { value: 'applications.status_approved', label: 'APPROVED' },
  { value: 'applications.status_completed', label: 'COMPLETED' },
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
  const { userInfo } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [assignBrokerApplicationId, setAssignBrokerApplicationId] = useState<string | null>(null);

  const { mutate: deleteApplication } = useDeleteApplication();

  const handleDelete = useCallback(
    (id: string, type: 'ANNOUNCEMENT_PUBLICATION' | 'ANNOUNCEMENT_MODIFICATION') => {
      Alert.alert(
        t('applications.delete.dialog.title'),
        t('applications.delete.dialog.description'),
        [
          { text: t('applications.delete.dialog.cancel'), style: 'cancel' },
          {
            text: t('applications.delete.dialog.confirm'),
            style: 'destructive',
            onPress: () => {
              deleteApplication(
                { id, type },
                {
                  onSuccess: () => {
                    Alert.alert('', t('applications.delete.success'));
                  },
                  onError: () => {
                    Alert.alert(t('common.error'), t('applications.delete.error'));
                  },
                }
              );
            },
          },
        ]
      );
    },
    [deleteApplication, t]
  );

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

  const handlePress = (id: string) => {
    router.push({
      pathname: '/announcement/form/[id]',
      params: { id },
    });
  };

  const handleCloseAssignBroker = () => {
    setAssignBrokerApplicationId(null);
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
        renderItem={({ item: row }) => {
          const announcementOwnerId = row.announcementCreatedBy?.id || row.createdBy?.id;
          const isAnnouncementOwner =
            !!userInfo?.id && !!announcementOwnerId && announcementOwnerId === userInfo.id;
          const isDraft = row.status?.code === 'DRAFT';

          return (
            <ApplicationCard
              item={row}
              onAddBrokerPress={() => setAssignBrokerApplicationId(row.id)}
              onPress={() => handlePress(row.id)}
              onDeletePress={
                isAnnouncementOwner && isDraft
                  ? () => handleDelete(row.id, row.type as any)
                  : undefined
              }
              className="max-w-full"
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      <AssignBrokerModal
        visible={assignBrokerApplicationId !== null}
        applicationId={assignBrokerApplicationId ?? ''}
        onClose={handleCloseAssignBroker}
      />
    </ThemedView>
  );
}
