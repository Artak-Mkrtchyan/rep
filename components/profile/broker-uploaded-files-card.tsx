import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ProfileEditIcon } from '@/components/icons/profile-edit-icon';
import { PROFILE_CARD_SHADOW } from '@/components/profile/profile-card-tokens';
import { ThemedText } from '@/components/themed-text';

const NEUTRAL_50 = '#F1F1F1';
const NEUTRAL_500 = '#777777';
const NEUTRAL_950 = '#111111';
const MAIN_500 = '#087443';
const EDIT_ICON = 20;
const EDIT_CHIP = 32;
const THUMB_SIZE = 24;

export type BrokerUploadedFileRow = {
  id: string;
  name: string;
  thumbnailUri?: string;
};

export type BrokerUploadedFilesCardProps = {
  files: BrokerUploadedFileRow[];
  onEditPress?: () => void;
  onDownloadPress?: (file: BrokerUploadedFileRow) => void;
  onDeletePress?: (file: BrokerUploadedFileRow) => void;
  onUploadPress?: () => void;
};

export const BrokerUploadedFilesCard: React.FC<BrokerUploadedFilesCardProps> = ({
  files,
  onEditPress,
  onDownloadPress,
  onDeletePress,
  onUploadPress,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.sectionTitle}>
          {t('profile.uploaded_files', 'Uploaded files')}
        </ThemedText>
        {onEditPress ? (
          <Pressable
            onPress={onEditPress}
            style={styles.editChip}
            accessibilityRole="button"
            accessibilityLabel={t('profile.edit_profile', 'Edit')}>
            <ProfileEditIcon width={EDIT_ICON} height={EDIT_ICON} color={NEUTRAL_950} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.list}>
        {files.length === 0 ? (
          <ThemedText style={styles.emptyHint}>
            {t('profile.uploaded_files_empty', 'No files uploaded')}
          </ThemedText>
        ) : (
          files.map((file) => (
            <View key={file.id} style={styles.fileRow}>
              <View style={styles.thumbWrap}>
                {file.thumbnailUri ? (
                  <Image
                    source={{ uri: file.thumbnailUri }}
                    style={styles.thumb}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.thumbPlaceholder}>
                    <Ionicons name="document-text-outline" size={14} color={MAIN_500} />
                  </View>
                )}
              </View>
              <ThemedText style={styles.fileName} numberOfLines={1}>
                {file.name}
              </ThemedText>
              <View style={styles.fileActions}>
                {onDownloadPress ? (
                  <Pressable
                    onPress={() => onDownloadPress(file)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.download', 'Download')}>
                    <Ionicons name="download-outline" size={20} color={NEUTRAL_950} />
                  </Pressable>
                ) : null}
                {onDeletePress ? (
                  <Pressable
                    onPress={() => onDeletePress(file)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={t('ui.remove_file', 'Remove file')}>
                    <Ionicons name="trash-outline" size={20} color="#E53935" />
                  </Pressable>
                ) : null}
              </View>
            </View>
          ))
        )}
      </View>

      {onUploadPress ? (
        <View style={styles.uploadSection}>
          <Ionicons name="image-outline" size={32} color={NEUTRAL_500} />
          <ThemedText style={styles.uploadLabel}>
            {t('ui.upload_your_photo', 'Upload your photo')}
          </ThemedText>
          <Pressable
            onPress={onUploadPress}
            style={styles.uploadButton}
            accessibilityRole="button">
            <ThemedText style={styles.uploadButtonText}>
              {t('ui.select_file', 'Upload')}
            </ThemedText>
            <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...PROFILE_CARD_SHADOW,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: NEUTRAL_950,
  },
  editChip: {
    width: EDIT_CHIP,
    height: EDIT_CHIP,
    borderRadius: EDIT_CHIP / 2,
    backgroundColor: NEUTRAL_50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 8,
  },
  emptyHint: {
    fontSize: 14,
    lineHeight: 20,
    color: NEUTRAL_500,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  thumbPlaceholder: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: NEUTRAL_50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: MAIN_500,
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    paddingTop: 16,
    alignItems: 'center',
    gap: 8,
  },
  uploadLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: NEUTRAL_500,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: MAIN_500,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
