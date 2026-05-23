import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ApplicationCommentBanner } from '@/components/announcement/application-comment-banner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FileUpload } from '@/components/ui/file-upload';
import { ANNOUNCEMENT_MAX_FILE_SIZE } from '@/constants/announcement';
import { useExitAnnouncementFlow, useHandleNextPress } from '@/hooks/use-announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { Image } from 'expo-image';

export default function MediaScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const documentIds = useAnnouncementForRentFormStore((s) => s.formData.documentIds);
  const metaData = useAnnouncementForRentFormStore((s) => s.metaData);
  const tempDocumentFiles = metaData?.tempDocumentFiles;
  const isAnnouncementEdit = metaData?.isAnnouncementEdit;
  const update = useAnnouncementForRentFormStore((s) => s.update);
  const nextStep = useHandleNextPress();
  const exitFlow = useExitAnnouncementFlow();
  const sendFormData = useAnnouncementForRentFormStore((s) => s.sendFormData);

  const documentFiles =
    documentIds?.filter(Boolean).map((id) => {
      const file = tempDocumentFiles?.find((f) => f.id === id);
      return {
        id,
        uri: file?.uri || '',
        type: 'application/pdf' as const,
        name: file?.name,
      };
    }) || [];

  const handleDocumentIdsChange = (
    attachments: { id: string; uri: string; type?: string; name?: string }[]
  ) => {
    const documentIds = attachments.map((attachment) => attachment.id);
    update({
      formData: { documentIds },
      metaData: { tempDocumentFiles: attachments, isChangeFields: true },
    });
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
          <ApplicationCommentBanner
            status={metaData?.response?.status?.code}
            comment={metaData?.applicationComment}
          />
          <ThemedText className="mb-2 text-[16px] font-bold text-foreground">
            {t('announcement.rent.add_documents_title')}
          </ThemedText>
          <ThemedText className="font-regular mb-4 text-[12px] text-muted-foreground">
            {t('announcement.rent.add_documents_subtitle')}
          </ThemedText>

          <FileUpload
            hint={t('ui.upload_your_file')}
            value={documentFiles}
            allowedFileTypes={['application/pdf']}
            maxFileSize={ANNOUNCEMENT_MAX_FILE_SIZE}
            icon={
              <Image
                source={require('@/assets/images/upload.svg')}
                style={{ width: 24, height: 24 }}
                tintColor="black"
                contentFit="contain"
              />
            }
            onChange={handleDocumentIdsChange}
          />
        </View>
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel={t('common.next')}
        firstButtonDisabled={false}
        secondButtonLabel={t('common.save_and_exit')}
        onNextPress={nextStep}
        onSaveAndExitPress={handleSaveAndExit}
        hideSecondButton={isAnnouncementEdit}
      />
    </ThemedView>
  );
}
