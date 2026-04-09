import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { InputError } from '@/components/ui/input/error';
import { InputLabel } from '@/components/ui/input/label';
import { applicationsService } from '@/lib/api/applications';
import { ERROR_MESSAGES, showErrorAlert } from '@/lib/error-handler';
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
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

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
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileUpload = async () => {
    if (disabled || isUploading) return;

    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: allowedFileTypes || ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        if (asset.size && asset.size > MAX_FILE_SIZE) {
          Alert.alert(t('ui.file_too_large_title'), t('ui.file_too_large_message'));
          return;
        }

        let formData = new FormData();

        formData.append('file', {
          uri: asset.uri,
          type: asset.mimeType || 'application/octet-stream',
          name: asset.name.toLowerCase() || 'file',
        } as any);

        const response = await applicationsService.uploadTemporaryAttachment(formData);
        onChange?.([
          ...value,
          { id: response.id, uri: asset.uri, type: asset.mimeType, name: asset.name.toLowerCase() },
        ]);
      }
    } catch (error) {
      handleUploadError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadError = (error: unknown) => {
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
        /* Empty State - Original Design */
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
        /* Files List - wrap to next line */
        <View className="mt-2 w-full flex-row flex-wrap gap-3">
          {/* Uploaded Files */}
          {value.map((attachment, index) => (
            <View
              key={attachment.id}
              className="relative h-[95px] w-[109px] overflow-visible rounded-[12px] border border-default bg-card">
              {/* Remove Button */}
              <Pressable
                onPress={() => handleRemoveFile(index)}
                disabled={disabled}
                className="absolute right-[-6px] top-[-6px] z-10 h-[22px] w-[22px] items-center justify-center rounded-full bg-destructive"
                accessibilityRole="button"
                accessibilityLabel={t('ui.remove_file')}>
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </Pressable>

              {/* File Preview */}
              <View className="h-full w-full items-center justify-center p-3">
                {attachment.type === 'application/pdf' ? (
                  <Image
                    source={require('@/assets/images/pdf-icon.svg')}
                    style={{ width: 28, height: 28 }}
                    contentFit="contain"
                  />
                ) : (
                  <Image
                    source={{ uri: attachment.uri }}
                    style={{ width: 100, height: 100 }}
                    contentFit="contain"
                  />
                )}
              </View>
            </View>
          ))}

          {/* Add Button */}
          <Pressable
            onPress={handleFileUpload}
            disabled={disabled || isUploading}
            className="h-[95px] w-[109px] items-center justify-center rounded-[12px] border border-default bg-muted"
            style={({ pressed }) =>
              pressed && !disabled && !isUploading ? { opacity: 0.9 } : undefined
            }
            accessibilityRole="button"
            accessibilityLabel={t('ui.add_file')}
            accessibilityState={{ disabled: disabled || isUploading }}>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-card">
              {icon || (
                <Image
                  source={require('@/assets/images/gallery.svg')}
                  style={{ width: 24, height: 24 }}
                  contentFit="contain"
                />
              )}
            </View>
            <ThemedText className="mt-2 text-[14px] font-medium text-foreground">
              {isUploading ? t('ui.uploading') : t('common.add')}
            </ThemedText>
          </Pressable>
        </View>
      )}

      {error && <InputError>{error}</InputError>}
    </View>
  );
};
