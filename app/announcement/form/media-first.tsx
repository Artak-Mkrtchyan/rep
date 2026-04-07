import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FileUpload } from '@/components/ui/file-upload';
import { useHandleNextPress } from '@/hooks/use-announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';

export default function MediaScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const mediaFileIds = useAnnouncementForRentFormStore((s) => s.formData.mediaFileIds);
  const tempMediaFiles = useAnnouncementForRentFormStore((s) => s.metaData?.tempMediaFiles);
  const update = useAnnouncementForRentFormStore((s) => s.update);
  const sendFormData = useAnnouncementForRentFormStore((s) => s.sendFormData);
  const nextStep = useHandleNextPress();

  const mediaFiles =
    mediaFileIds?.map((id) => {
      const file = tempMediaFiles?.find((f) => f.id === id);
      return { id, uri: file?.uri || '' };
    }) || [];

  const handlePhotoIdsChange = (
    attachments: { id: string; uri: string; type?: string; name?: string }[]
  ) => {
    const mediaFileIds = attachments.map((attachment) => attachment.id);
    update({ formData: { mediaFileIds }, metaData: { tempMediaFiles: attachments } });
  };

  const handleSaveAndExit = async () => {
    try {
      await sendFormData();
    } catch {
      Alert.alert(t('common.error'), t('error.failed_to_send_form'));
    } finally {
      router.back();
    }
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 31 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="pt-[24px]" style={horizontalStyle}>
          <ThemedText className="mb-2 text-[20px] font-bold text-foreground">
            {t('announcement.rent.add_photos_title')}
          </ThemedText>
          <ThemedText className="mb-6 text-[14px] text-muted-foreground">
            {t('announcement.rent.add_photos_subtitle')}
          </ThemedText>

          <FileUpload
            hint={t('ui.upload_your_photo')}
            value={mediaFiles}
            onChange={handlePhotoIdsChange}
          />
        </View>
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel={t('common.next')}
        firstButtonDisabled={!mediaFiles?.length}
        secondButtonLabel={t('common.save_and_exit')}
        onNextPress={nextStep}
        onSaveAndExitPress={handleSaveAndExit}
      />
    </ThemedView>
  );
}
