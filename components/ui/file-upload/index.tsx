import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { Alert, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { InputError } from '@/components/ui/input/error';
import { InputLabel } from '@/components/ui/input/label';
import { useThemeValue } from '@/hooks/use-theme';
import { applicationsService } from '@/lib/api/applications';
import { ApiError } from '@/lib/api/auth.types';
import { Image } from 'expo-image';

export interface FileUploadProps {
  label?: string;
  description?: string;
  value?: string[];
  onChange?: (attachmentIds: string[]) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  value = [],
  onChange,
  error,
  required,
  disabled = false,
  containerClassName,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<Record<string, string>>({});
  const foregroundColor = useThemeValue('foreground');
  const handleFileUpload = async () => {
    if (disabled || isUploading) return;

    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        let formData = new FormData();

        formData.append('file', {
          uri: asset.uri,
          type: asset.mimeType || 'application/octet-stream',
          name: asset.name.toLowerCase() || 'file',
        } as any);

        const response = await applicationsService.uploadTemporaryAttachment(formData);
        onChange?.([...value, response.id]);
        setUploadedFiles((prev) => ({ ...prev, [response.id]: asset.uri }));
      }
    } catch (error) {
      handleUploadError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadError = (error: unknown) => {
    if (error instanceof Error && 'statusCode' in error) {
      const apiError = error as ApiError;
      Alert.alert('Upload Failed', apiError.message || 'Failed to upload file. Please try again.');
    } else {
      Alert.alert('Error', 'An unexpected error occurred while uploading the file.');
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    if (disabled) return;
    const newIds = value.filter((_, index) => index !== indexToRemove);
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[value[indexToRemove]];
      return next;
    });
    onChange?.(newIds);
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
            <Image
              source={require('@/assets/images/gallery.svg')}
              style={{ width: 24, height: 24 }}
              contentFit="contain"
            />
          </View>
          <ThemedText className="text-[14px] text-foreground">
            {isUploading ? 'Uploading...' : 'Upload your photo'}
          </ThemedText>
          <Pressable
            onPress={handleFileUpload}
            disabled={disabled || isUploading}
            className="h-10 flex-row items-center justify-center gap-2 rounded-[10px] bg-primary px-5"
            style={({ pressed }) =>
              pressed && !disabled && !isUploading ? { opacity: 0.9 } : undefined
            }
            accessibilityRole="button"
            accessibilityLabel="Select file"
            accessibilityState={{ disabled: disabled || isUploading }}>
            <ThemedText className="text-[14px] font-medium text-white">
              {isUploading ? 'Uploading...' : 'Select file'}
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
          {value.map((id, index) => (
            <View
              key={id}
              className="relative h-[95px] w-[109px] overflow-visible rounded-[12px] border border-default bg-card">
              {/* Remove Button */}
              <Pressable
                onPress={() => handleRemoveFile(index)}
                disabled={disabled}
                className="absolute right-[-6px] top-[-6px] z-10 h-[22px] w-[22px] items-center justify-center rounded-full bg-destructive"
                accessibilityRole="button"
                accessibilityLabel="Remove file">
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </Pressable>

              {/* File Preview */}
              <View className="h-full w-full items-center justify-center p-3">
                {uploadedFiles[id] ? (
                  <Image
                    source={{ uri: uploadedFiles[id] }}
                    style={{ width: 100, height: 100 }}
                    contentFit="contain"
                  />
                ) : (
                  <>
                    <Ionicons name="document-outline" size={48} color={foregroundColor} />
                    <ThemedText
                      className="mt-2 text-center text-[11px] text-foreground"
                      numberOfLines={2}>
                      File {index + 1}
                    </ThemedText>
                  </>
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
            accessibilityLabel="Add file"
            accessibilityState={{ disabled: disabled || isUploading }}>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-card">
              <Image
                source={require('@/assets/images/gallery.svg')}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            </View>
            <ThemedText className="mt-2 text-[12px] text-foreground">
              {isUploading ? 'Uploading...' : 'Add'}
            </ThemedText>
          </Pressable>
        </View>
      )}

      {error && <InputError>{error}</InputError>}
    </View>
  );
};
