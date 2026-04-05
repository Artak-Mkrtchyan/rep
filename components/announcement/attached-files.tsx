import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Share, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AnnouncementDocument } from '@/types/api';

const CARD_SHADOW: ViewStyle = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

const ROW_SHADOW: ViewStyle = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 16,
  elevation: 2,
};

const PAGE_SIZE = 9;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0B';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i)) + (sizes[i] ?? '');
};

const isPdf = (contentType: string): boolean => {
  return contentType.toLowerCase().includes('pdf');
};

const getFileExtension = (contentType: string): string => {
  const ext = contentType.split('/').pop();
  return ext?.toUpperCase() || 'FILE';
};

type AttachedFilesProps = {
  documents: AnnouncementDocument[];
};

export const AttachedFiles: React.FC<AttachedFilesProps> = ({ documents }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(documents.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentDocs = documents.slice(startIndex, startIndex + PAGE_SIZE);

  const handleDownload = useCallback(
    async (doc: AnnouncementDocument) => {
      if (!doc.url) return;

      try {
        // Open in in-app browser (Safari/Chrome sheet) which handles file downloads natively
        await WebBrowser.openBrowserAsync(doc.url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        });
      } catch {
        // Fallback: offer to share the URL so user can open it manually
        try {
          await Share.share({ url: doc.url, title: doc.fileName });
        } catch {
          Alert.alert(t('common.error'), t('announcement.detail.download_failed'));
        }
      }
    },
    [t]
  );

  if (documents.length === 0) return null;

  return (
    <View className="rounded-2xl bg-white p-4" style={CARD_SHADOW}>
      <ThemedText className="mb-4 text-[20px] font-semibold text-foreground">
        {t('announcement.detail.attached_files')}
      </ThemedText>

      <View className="gap-3">
        {currentDocs.map((doc) => (
          <View
            key={doc.id}
            className="flex-row items-center gap-3 rounded-xl bg-white p-4"
            style={ROW_SHADOW}
          >
            <ThemedText
              className="flex-1 text-[14px] font-medium text-foreground"
              numberOfLines={1}
            >
              {doc.fileName}
            </ThemedText>

            <View className="flex-row items-center gap-1.5">
              {isPdf(doc.contentType) && (
                <Ionicons name="document-text" size={20} color="#EF4444" />
              )}
              <ThemedText className="text-[12px] font-bold text-primary">
                {getFileExtension(doc.contentType)}
              </ThemedText>
            </View>

            <ThemedText className="min-w-[40px] text-right text-[12px] text-muted-foreground">
              {formatFileSize(doc.sizeInBytes)}
            </ThemedText>

            <Pressable
              onPress={() => handleDownload(doc)}
              hitSlop={8}
              accessibilityLabel={`Download ${doc.fileName}`}
            >
              <Ionicons name="download-outline" size={20} color="#6B7280" />
            </Pressable>
          </View>
        ))}
      </View>

      {totalPages > 1 && (
        <View className="mt-4 flex-row items-center justify-center gap-4 pt-2">
          <Pressable
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            hitSlop={8}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={currentPage === 1 ? '#D1D5DB' : '#0E9457'}
            />
          </Pressable>
          <ThemedText className="text-[14px] text-muted-foreground">
            {t('announcement.detail.page')} {currentPage}{' '}
            {t('announcement.detail.of_page')} {totalPages}
          </ThemedText>
          <Pressable
            onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            hitSlop={8}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={currentPage === totalPages ? '#D1D5DB' : '#0E9457'}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};
