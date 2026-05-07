import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useGetMyApplicationsInfinite } from '@/hooks/api/use-applications';
import type { AnnouncementPublicationListResponse } from '@/lib/api/applications';
import { cn } from '@/lib/utils';

const flatGeoLine = (item: AnnouncementPublicationListResponse): string => {
  const g = item.geo;
  if (g?.formattedAddress?.trim()) return g.formattedAddress.trim();
  return [g?.street, g?.locality, g?.province].filter(Boolean).join(', ');
};

interface Props {
  visible: boolean;
  selectedId?: string;
  onSelect: (application: AnnouncementPublicationListResponse | null) => void;
  onClose: () => void;
}

const PAGE_SIZE = 15;

/**
 * Picker for "my approved applications" used by the create-booking form
 * to autofill listing/property/address (Figma `12353:30220` Application ID).
 */
export const ApplicationPickerSheet: React.FC<Props> = ({
  visible,
  selectedId,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Only approved/completed applications are bookable per the use-case spec.
  const query = useGetMyApplicationsInfinite({ pageSize: PAGE_SIZE, filter: 'APPROVED' }, visible);

  const applications = useMemo(
    () => query.data?.pages.flatMap((p) => p.content) ?? [],
    [query.data]
  );

  const handleLoadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const handleClear = () => {
    onSelect(null);
    onClose();
  };

  const handleSelectItem = (application: AnnouncementPublicationListResponse) => {
    onSelect(application);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable
          className="absolute inset-0"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
        />
        <View
          className="h-[85%] rounded-t-[24px] bg-white"
          style={{ paddingBottom: insets.bottom }}>
          <View className="flex-row items-center justify-between px-4 pb-3 pt-3">
            <Pressable onPress={onClose} accessibilityRole="button" hitSlop={8}>
              <ThemedText className="text-[16px] text-neutral-500">{t('common.cancel')}</ThemedText>
            </Pressable>
            <ThemedText className="text-[18px] font-semibold text-foreground">
              {t('booking.application_id')}
            </ThemedText>
            {selectedId ? (
              <Pressable onPress={handleClear} accessibilityRole="button" hitSlop={8}>
                <ThemedText className="text-[14px] font-semibold text-primary">
                  {t('common.clear')}
                </ThemedText>
              </Pressable>
            ) : (
              <View className="w-12" />
            )}
          </View>

          {query.isLoading && applications.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={applications}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
              renderItem={({ item }) => {
                const selected = selectedId === item.id;
                return (
                  <Pressable
                    onPress={() => handleSelectItem(item)}
                    className={cn(
                      'rounded-[12px] border bg-white p-3',
                      selected ? 'border-primary' : 'border-default'
                    )}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}>
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="min-w-0 flex-1">
                        <ThemedText
                          className="text-[14px] font-semibold text-foreground"
                          numberOfLines={1}>
                          {item.title || t('booking.application_id_placeholder')}
                        </ThemedText>
                        <ThemedText className="mt-1 text-[12px] text-neutral-500">
                          {t('booking.id_label')}: {item.publicId}
                        </ThemedText>
                        <ThemedText
                          className="mt-1 text-[12px] text-neutral-500"
                          numberOfLines={1}>
                          {flatGeoLine(item)}
                        </ThemedText>
                      </View>
                      {selected ? (
                        <Ionicons name="checkmark-circle" size={20} color="#0F7B3F" />
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              ListEmptyComponent={
                <View className="items-center py-12">
                  <ThemedText className="text-[14px] text-neutral-500">
                    {t('booking.empty.no_applications')}
                  </ThemedText>
                </View>
              }
              ListFooterComponent={
                query.isFetchingNextPage ? (
                  <View className="py-4">
                    <ActivityIndicator />
                  </View>
                ) : null
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};
