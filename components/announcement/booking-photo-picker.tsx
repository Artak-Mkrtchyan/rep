import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { useEligibleBookingsForUpload } from '@/hooks/api/use-bookings';
import { useToast } from '@/hooks/use-toast';
import { bookingsService } from '@/lib/api/bookings';
import { cn } from '@/lib/utils';
import { BookingListItem, BookingPhoto } from '@/types/bookings';

export type BookingPhotoPickerProps = {
  onPhotosImported: (photos: { id: string; uri: string; type?: string; name?: string }[]) => void;
  existingPhotoIds: string[];
};

export const BookingPhotoPicker = ({
  onPhotosImported,
  existingPhotoIds,
}: BookingPhotoPickerProps) => {
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const toast = useToast();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<BookingListItem[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Fetch bookings eligible for photo upload
  const { data, isLoading } = useEligibleBookingsForUpload(modalVisible);

  // Filter completed photo shoot bookings created by the logged in user
  const eligibleBookings = React.useMemo(() => {
    if (!data?.content) return [];
    return data.content.filter(
      (b) =>
        b.status?.code === 'COMPLETED' &&
        b.type?.code === 'PHOTO_SHOOT' &&
        b.createdBy?.id === userInfo?.id
    );
  }, [data?.content, userInfo?.id]);

  const handleToggleBooking = (booking: BookingListItem) => {
    setSelectedBookings((prev) => {
      const isSelected = prev.some((b) => b.id === booking.id);
      if (isSelected) {
        return prev.filter((b) => b.id !== booking.id);
      } else {
        return [...prev, booking];
      }
    });
  };

  const handleImport = async () => {
    if (selectedBookings.length === 0) {
      setModalVisible(false);
      return;
    }

    setIsImporting(true);
    let importedPhotosCount = 0;
    const allImportedPhotos: { id: string; uri: string; type?: string; name?: string }[] = [];

    try {
      // Fetch photos for all selected bookings in parallel
      const photoPromises = selectedBookings.map((booking) =>
        bookingsService.getPhotoShootPhotos(booking.id, 0, 100)
      );

      const results = await Promise.all(photoPromises);

      results.forEach((res) => {
        if (res?.content) {
          res.content.forEach((photo: BookingPhoto) => {
            // Avoid duplicate photo IDs
            if (!existingPhotoIds.includes(photo.id)) {
              allImportedPhotos.push({
                id: photo.id,
                uri: photo.url,
                type: photo.fileType,
                name: photo.fileName,
              });
              importedPhotosCount++;
            }
          });
        }
      });

      if (allImportedPhotos.length > 0) {
        onPhotosImported(allImportedPhotos);
        toast.success(
          t('common.success'),
          t('announcement.rent.upload_from_booking_success', { count: importedPhotosCount })
        );
      } else {
        toast.info(
          t('common.info'),
          t('announcement.rent.upload_from_booking_empty')
        );
      }
      setModalVisible(false);
    } catch {
      toast.error(t('common.error'), t('error.failed_to_load_application'));
    } finally {
      setIsImporting(false);
    }
  };

  const selectedDisplayLabel = selectedBookings
    .map((b) => b.publicId || b.id)
    .join(', ');

  return (
    <View className="mb-6 w-full gap-2">
      <ThemedText className="text-[14px] font-semibold text-foreground">
        {t('announcement.rent.upload_from_booking')}
      </ThemedText>

      <Pressable
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={t('announcement.rent.upload_from_booking')}
        className={cn(
          'h-12 flex-row items-center justify-between rounded-[12px] border px-3 border-default bg-card'
        )}>
        <ThemedText
          className={cn(
            'font-regular text-[16px] min-w-0 flex-1',
            selectedDisplayLabel ? 'text-foreground' : 'text-muted-foreground'
          )}
          numberOfLines={1}>
          {selectedDisplayLabel || t('announcement.rent.upload_from_booking_placeholder')}
        </ThemedText>
        <Ionicons name="chevron-down" size={20} color="#C6C6C6" className="ml-2 shrink-0" />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent>
        <View className="flex-1 justify-end bg-black/50">
          <Pressable
            className="absolute inset-0"
            onPress={() => setModalVisible(false)}
          />
          <View className="max-h-[80%] rounded-t-[24px] bg-white pb-8">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-neutral-100 px-6 py-4">
              <ThemedText className="text-[18px] font-bold text-foreground">
                {t('announcement.rent.upload_from_booking')}
              </ThemedText>
              <Pressable
                onPress={() => setModalVisible(false)}
                hitSlop={8}
                className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
                <Ionicons name="close" size={20} color="#111" />
              </Pressable>
            </View>

            {/* Content list */}
            {isLoading ? (
              <View className="py-20 items-center justify-center">
                <ActivityIndicator size="large" color="#FF7E40" />
              </View>
            ) : eligibleBookings.length === 0 ? (
              <View className="py-20 items-center justify-center px-6">
                <Ionicons name="images-outline" size={48} color="#C6C6C6" />
                <ThemedText className="mt-4 text-center text-[14px] text-muted-foreground">
                  {t('announcement.rent.upload_from_booking_empty')}
                </ThemedText>
              </View>
            ) : (
              <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
                <View className="gap-3">
                  {eligibleBookings.map((booking) => {
                    const isChecked = selectedBookings.some((b) => b.id === booking.id);
                    return (
                      <Pressable
                        key={booking.id}
                        onPress={() => handleToggleBooking(booking)}
                        className={cn(
                          'flex-row items-center justify-between rounded-[12px] border p-4 active:bg-neutral-50',
                          isChecked ? 'border-primary bg-primary/5' : 'border-neutral-100'
                        )}>
                        <View className="flex-1 gap-1">
                          <ThemedText className="text-[14px] font-bold text-foreground">
                            {booking.publicId || booking.id}
                          </ThemedText>
                          <ThemedText className="text-[12px] text-muted-foreground" numberOfLines={1}>
                            {booking.title}
                          </ThemedText>
                        </View>
                        <Ionicons
                          name={isChecked ? 'checkbox' : 'square-outline'}
                          size={24}
                          color={isChecked ? '#FF7E40' : '#C6C6C6'}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            )}

            {/* Footer actions */}
            {!isLoading && eligibleBookings.length > 0 && (
              <View className="px-6 pt-4 border-t border-neutral-100">
                <Pressable
                  onPress={handleImport}
                  disabled={isImporting || selectedBookings.length === 0}
                  className={cn(
                    'h-12 w-full items-center justify-center rounded-[12px] bg-primary flex-row gap-2',
                    (isImporting || selectedBookings.length === 0) && 'opacity-50'
                  )}>
                  {isImporting ? (
                    <>
                      <ActivityIndicator size="small" color="#fff" />
                      <ThemedText className="text-[16px] font-bold text-white">
                        {t('announcement.rent.upload_from_booking_loading')}
                      </ThemedText>
                    </>
                  ) : (
                    <ThemedText className="text-[16px] font-bold text-white">
                      {t('announcement.rent.upload_from_booking_import_btn')} ({selectedBookings.length})
                    </ThemedText>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
