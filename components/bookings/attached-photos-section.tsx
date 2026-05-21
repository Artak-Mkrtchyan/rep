import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { usePhotoShootPhotos } from '@/hooks/api/use-bookings';

import { formatFileSize } from './format';

const CARD_SHADOW: ViewStyle = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

const PAGE_SIZE = 9;

interface Props {
  bookingId: string;
  /** Hint count from BookingDetails — used to short-circuit render. */
  numberOfUploadedPhotos?: number;
}

const getExtension = (fileType: string, fileName: string): string => {
  const fromType = fileType.split('/').pop();
  if (fromType) return fromType.toUpperCase();
  const dot = fileName.lastIndexOf('.');
  return dot >= 0 ? fileName.slice(dot + 1).toUpperCase() : 'FILE';
};

/**
 * "Attached files by photographers" card on the booking detail screen
 * (Figma `6736:116390`). Paginated list of photos with view/download actions
 * plus a "Download all" hyperlink.
 */
export const AttachedPhotosSection: React.FC<Props> = ({
  bookingId,
  numberOfUploadedPhotos,
}) => {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(0);

  const enabled = !!bookingId && (numberOfUploadedPhotos ?? 1) > 0;
  const { data, isLoading, error } = usePhotoShootPhotos(bookingId, page, PAGE_SIZE, enabled);

  const handleView = useCallback(async (url: string) => {
    if (!url) return;
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    } catch {
      Alert.alert('', '');
    }
  }, []);

  const handleDownload = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        await WebBrowser.openBrowserAsync(url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        });
      } catch {
        Alert.alert(t('common.error'), t('booking.attached.download_failed'));
      }
    },
    [t]
  );

  const handleDownloadAll = useCallback(async () => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
      const url = `${baseUrl}/v1/bookings/photo-shoots/${encodeURIComponent(bookingId)}/photos/zip`;
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    } catch {
      Alert.alert(t('common.error'), t('booking.attached.download_failed'));
    }
  }, [bookingId, t]);

  if (!enabled) return null;

  if (isLoading && !data) {
    return (
      <View className="rounded-2xl bg-white p-4" style={CARD_SHADOW}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View className="rounded-2xl bg-white p-4" style={CARD_SHADOW}>
        <ThemedText className="text-center text-[14px] text-neutral-500">
          {t('booking.attached.error')}
        </ThemedText>
      </View>
    );
  }

  const items = data?.content ?? [];
  if (items.length === 0) return null;

  const totalPages = data?.totalPages ?? 1;
  const sizeUnits: [string, string, string, string] = [
    t('file_size.bytes', { defaultValue: 'B' }),
    t('file_size.kb', { defaultValue: 'KB' }),
    t('file_size.mb', { defaultValue: 'MB' }),
    t('file_size.gb', { defaultValue: 'GB' }),
  ];
  const lang = i18n.language;
  void lang;

  return (
    <View className="rounded-2xl bg-white p-4" style={CARD_SHADOW}>
      <View className="mb-3 flex-row items-center justify-between gap-3">
        <ThemedText className="flex-1 text-[16px] font-bold leading-[20px] text-foreground">
          {t('booking.attached.title')}
        </ThemedText>
        <Pressable
          onPress={handleDownloadAll}
          accessibilityRole="button"
          accessibilityLabel={t('booking.attached.download_all')}
          hitSlop={6}
          className="flex-row items-center gap-1">
          <ThemedText className="text-[14px] font-semibold text-primary">
            {t('booking.attached.download_all')}
          </ThemedText>
          <Ionicons name="download-outline" size={18} color="#0F7B3F" />
        </Pressable>
      </View>

      <View className="gap-2">
        {items.map((photo, idx) => (
          <View
            key={photo.id}
            className={`flex-row items-center gap-3 rounded-[12px] px-3 py-2 ${
              idx % 2 === 1 ? 'bg-neutral-50' : 'bg-white'
            }`}>
            <ThemedText
              className="flex-1 text-[13px] font-medium text-foreground"
              numberOfLines={1}>
              {photo.fileName.replace(/\.[^.]+$/, '')}
            </ThemedText>
            {photo.thumbnailUrl ? (
              <View className="h-6 w-6 overflow-hidden rounded-full">
                <Image
                  source={{ uri: photo.thumbnailUrl }}
                  style={{ width: 24, height: 24 }}
                  contentFit="cover"
                />
              </View>
            ) : null}
            <ThemedText className="text-[12px] font-bold text-primary">
              {getExtension(photo.fileType, photo.fileName)}
            </ThemedText>
            <ThemedText className="min-w-[40px] text-right text-[12px] text-neutral-700">
              {formatFileSize(photo.sizeInBytes, sizeUnits)}
            </ThemedText>
            <Pressable
              onPress={() => handleView(photo.url)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={t('booking.attached.view')}>
              <Ionicons name="eye-outline" size={20} color="#0F7B3F" />
            </Pressable>
            <Pressable
              onPress={() => handleDownload(photo.url)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={t('booking.attached.download')}>
              <Ionicons name="download-outline" size={20} color="#0F7B3F" />
            </Pressable>
          </View>
        ))}
      </View>

      {totalPages > 1 ? (
        <View className="mt-3 flex-row items-center justify-center gap-3">
          <Pressable
            onPress={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            hitSlop={8}>
            <Ionicons
              name="chevron-back"
              size={20}
              color={page === 0 ? '#D1D5DB' : '#0F7B3F'}
            />
          </Pressable>
          <ThemedText className="text-[14px] text-neutral-700">
            {t('booking.attached.page', { current: page + 1, total: totalPages })}
          </ThemedText>
          <Pressable
            onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            hitSlop={8}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={page >= totalPages - 1 ? '#D1D5DB' : '#0F7B3F'}
            />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};
