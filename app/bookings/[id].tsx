import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';

import {
  AttachedPhotosSection,
  BookingDetailHeader,
  BookingDetailInfo,
  FeedbackSection,
  ChangeBookingStatusBottomSheet,
} from '@/components/bookings';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useBookingById } from '@/hooks/api/use-bookings';
import { ServiceType, BookingStatus } from '@/types/bookings';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const [statusSheetVisible, setStatusSheetVisible] = useState(false);

  const { data, isLoading, error, refetch, isRefetching } = useBookingById(id);

  if (isLoading && !data) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (error || !data) {
    return (
      <ThemedView className="flex-1 items-center justify-center px-6">
        <ThemedText className="text-center text-[16px] font-semibold text-foreground">
          {t('booking.details.error_title')}
        </ThemedText>
        <ThemedText className="mt-2 text-center text-[14px] text-neutral-500">
          {error?.message ?? t('error.unexpected')}
        </ThemedText>
      </ThemedView>
    );
  }

  const isPhotoShoot = data.type === ServiceType.PHOTO_SHOOT;
  const hasFeedbacks = (data.feedbacks?.length ?? 0) > 0;

  const isOwner = userInfo?.id === data.createdBy;
  const changeableStatuses = [
    BookingStatus.CONFIRMED,
    BookingStatus.PENDING_FOR_CONFIRMATION,
    BookingStatus.IN_PROGRESS,
    BookingStatus.WORK_COMPLETED,
  ];
  const canChange = isOwner && changeableStatuses.includes(data.status.code);

  return (
    <ThemedView className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={!!isRefetching} onRefresh={() => refetch()} />
        }>
        <BookingDetailHeader 
          booking={data} 
          onPressStatus={canChange ? () => setStatusSheetVisible(true) : undefined}
        />

        <View className="mt-4">
          <BookingDetailInfo booking={data} />
        </View>

        {hasFeedbacks ? (
          <View className="mt-6">
            <FeedbackSection feedbacks={data.feedbacks ?? []} />
          </View>
        ) : null}

        {isPhotoShoot ? (
          <View className="mt-6">
            <AttachedPhotosSection
              bookingId={data.id}
              numberOfUploadedPhotos={data.numberOfUploadedPhotos}
            />
          </View>
        ) : null}
      </ScrollView>

      {canChange && (
        <ChangeBookingStatusBottomSheet
          visible={statusSheetVisible}
          bookingId={data.id}
          currentStatus={data.status.code}
          onClose={() => setStatusSheetVisible(false)}
          onStatusChanged={() => refetch()}
        />
      )}
    </ThemedView>
  );
}

