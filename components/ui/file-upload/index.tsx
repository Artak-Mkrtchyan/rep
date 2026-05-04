import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionSheetIOS, Alert, Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { InputError } from '@/components/ui/input/error';
import { InputLabel } from '@/components/ui/input/label';
import { applicationsService } from '@/lib/api/applications';
import { ERROR_MESSAGES, isApiError, showErrorAlert } from '@/lib/error-handler';
import { Image } from 'expo-image';

type Attachment = {
  id: string;
  uri: string;
  type?: string;
  name?: string;
};

export interface FileUploadProps {
  label?: string;
  description?: string;
  value?: Attachment[];

  icon?: React.ReactNode;
  hint: string;

  allowedFileTypes?: string[];
  onChange?: (attachments: Attachment[]) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  maxFileSize?: number;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB

function safeUploadFileName(uri: string, name?: string): string {
  const base = name?.trim() || uri.split('/').pop()?.split('?')[0]?.trim() || 'file';
  return base.toLowerCase();
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  value = [],
  onChange,
  hint,
  icon,
  allowedFileTypes,
  error,
  required,
  disabled = false,
  containerClassName,
  maxFileSize,
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = React.useState(false);

  const uploadAsset = async (uri: string, mimeType: string, name?: string) => {
    const fileName = safeUploadFileName(uri, name);
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: mimeType || 'application/octet-stream',
      name: fileName || 'file',
    } as any);

    const response = await applicationsService.uploadTemporaryAttachment(formData);
    onChange?.([...value, { id: response.id, uri, type: mimeType, name: fileName }]);
  };

  const pickFromGallery = async () => {
    try {
      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        const imageLimit = maxFileSize ?? MAX_IMAGE_SIZE;
        if (asset.fileSize && asset.fileSize > imageLimit) {
          Alert.alert(
            t('ui.file_too_large_title'),
            t('ui.file_too_large_message', { size: Math.round(imageLimit / 1024 / 1024) })
          );
          return;
        }

        const fileName = asset.fileName || asset.uri.split('/').pop() || 'photo.jpg';
        const mimeType = asset.mimeType || 'image/jpeg';
        await uploadAsset(asset.uri, mimeType, fileName);
      }
    } catch (error) {
      handleUploadError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const pickFromFiles = async () => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedFileTypes || ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        const isPdf = asset.mimeType === 'application/pdf';
        const sizeLimit = maxFileSize ?? (isPdf ? MAX_PDF_SIZE : MAX_IMAGE_SIZE);
        if (asset.size && asset.size > sizeLimit) {
          Alert.alert(
            t('ui.file_too_large_title'),
            t('ui.file_too_large_message', { size: Math.round(sizeLimit / 1024 / 1024) })
          );
          return;
        }

        await uploadAsset(asset.uri, asset.mimeType || 'application/octet-stream', asset.name);
      }
    } catch (error) {
      handleUploadError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = () => {
    if (disabled || isUploading) return;

    const galleryLabel = t('ui.choose_gallery');
    const filesLabel = t('ui.choose_files');
    const cancelLabel = t('common.cancel');

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [cancelLabel, galleryLabel, filesLabel],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickFromGallery();
          else if (buttonIndex === 2) pickFromFiles();
        }
      );
    } else {
      Alert.alert(t('ui.select_file'), undefined, [
        { text: galleryLabel, onPress: pickFromGallery },
        { text: filesLabel, onPress: pickFromFiles },
        { text: cancelLabel, style: 'cancel' },
      ]);
    }
  };

  const handleUploadError = (error: unknown) => {
    if (isApiError(error) && error.validationErrors?.length) {
      const code = error.validationErrors[0].errorCode;
      if (code === 'validation.forbidden-image-content') {
        Alert.alert(t('ui.upload_failed'), t('error.forbidden_image_content'));
        return;
      }
    }
    showErrorAlert(error, { title: t('ui.upload_failed'), fallback: ERROR_MESSAGES.UPLOAD_FAILED });
  };

  const handleRemoveFile = (indexToRemove: number) => {
    if (disabled) return;
    const newAttachments = value.filter((_, index) => index !== indexToRemove);
    onChange?.(newAttachments);
  };

  return (
    <View className={containerClassName}>
      {label && (
        <View className="mb-2 flex-row items-center">
          <InputLabel required={required}>{label}</InputLabel>
        </View>
      )}

      {description && (
        <ThemedText className="mb-2 text-[12px] text-muted-foreground">{description}</ThemedText>
      )}

      {value.length === 0 ? (
        /* Empty State */
        <View className="w-full items-center gap-4 rounded-[12px] border border-default bg-muted p-6">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-card">
            {icon || (
              <Image
                source={require('@/assets/images/gallery.svg')}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            )}
          </View>
          <ThemedText className="font-regular text-[12px] text-foreground">
            {isUploading ? t('ui.uploading') : hint}
          </ThemedText>
          <Pressable
            onPress={handleFileUpload}
            disabled={disabled || isUploading}
            className="h-10 flex-row items-center justify-center gap-2 rounded-[10px] bg-primary px-5"
            style={({ pressed }) =>
              pressed && !disabled && !isUploading ? { opacity: 0.9 } : undefined
            }
            accessibilityRole="button"
            accessibilityLabel={t('ui.select_file')}
            accessibilityState={{ disabled: disabled || isUploading }}>
            <ThemedText className="text-[16px] font-medium text-white">
              {isUploading ? t('ui.uploading') : t('ui.select_file')}
            </ThemedText>
            <Image
              source={require('@/assets/images/upload.svg')}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
          </Pressable>
        </View>
      ) : (
        /* Populated state — Figma: 80x80 tiles in a 16px gap row */
        <View className="w-full flex-row flex-wrap gap-4">
          {/* Uploaded Files */}
          {value.map((attachment, index) => (
            <View key={attachment.id} className="relative h-[80px] w-[80px]">
              {/* File Preview */}
              <View className="h-full w-full overflow-hidden rounded-[16px] bg-card">
                {attachment.type === 'application/pdf' ? (
                  <View className="h-full w-full items-center justify-center">
                    <Image
                      source={require('@/assets/images/pdf-icon.svg')}
                      style={{ width: 28, height: 28 }}
                      contentFit="contain"
                    />
                  </View>
                ) : (
                  <Image
                    source={{ uri: attachment.uri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                )}
              </View>

              {/* Remove Button */}
              <Pressable
                onPress={() => handleRemoveFile(index)}
                disabled={disabled}
                hitSlop={8}
                className="absolute right-[-6px] top-[-6px] z-10 h-5 w-5 items-center justify-center rounded-full bg-destructive"
                accessibilityRole="button"
                accessibilityLabel={t('ui.remove_file')}>
                <Ionicons name="close" size={12} color="#FFFFFF" />
              </Pressable>
            </View>
          ))}

          {/* Add Button */}
          <Pressable
            onPress={handleFileUpload}
            disabled={disabled || isUploading}
            className="h-[80px] w-[80px] items-center justify-center rounded-[16px] border border-default bg-card"
            style={({ pressed }) => [
              {
                shadowColor: '#6E6E6E',
                shadowOffset: { width: 2, height: 3 },
                shadowOpacity: 0.15,
                shadowRadius: 16.5,
                elevation: 3,
              },
              pressed && !disabled && !isUploading ? { opacity: 0.9 } : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t('ui.add_file')}
            accessibilityState={{ disabled: disabled || isUploading }}>
            {icon || (
              <Image
                source={require('@/assets/images/gallery.svg')}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            )}
            <ThemedText className="mt-1 text-[14px] font-medium text-main-500">
              {isUploading ? t('ui.uploading') : t('common.add')}
            </ThemedText>
          </Pressable>
        </View>
      )}

      {error && <InputError>{error}</InputError>}
    </View>
  );
};
