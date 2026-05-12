import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FileUpload } from '@/components/ui/file-upload';
import { ANNOUNCEMENT_MAX_FILE_SIZE } from '@/constants/announcement';
import { useExitAnnouncementFlow, useHandleNextPress } from '@/hooks/use-announcement';
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
  const exitFlow = useExitAnnouncementFlow();

  const mediaFiles =
    mediaFileIds
      ?.filter(Boolean)
      .map((id) => {
        const file = tempMediaFiles?.find((f) => f.id === id);
        return { id, uri: file?.uri || '', type: file?.type, name: file?.name };
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
      exitFlow();
    } catch {
      Alert.alert(t('common.error'), t('error.failed_to_send_form'));
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
          <ThemedText className="mb-2 text-[16px] font-bold text-foreground">
            {t('announcement.rent.add_photos_title')}
          </ThemedText>
          <ThemedText className="font-regular mb-4 text-[12px] text-muted-foreground">
            {t('announcement.rent.add_photos_subtitle')}
          </ThemedText>

          <FileUpload
            hint={t('ui.upload_your_photo')}
            value={mediaFiles}
            maxFileSize={ANNOUNCEMENT_MAX_FILE_SIZE}
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
