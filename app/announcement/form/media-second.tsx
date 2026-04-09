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
import { Image } from 'expo-image';

export default function MediaScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const documentIds = useAnnouncementForRentFormStore((s) => s.formData.documentIds);
  const update = useAnnouncementForRentFormStore((s) => s.update);
  const nextStep = useHandleNextPress();
  const sendFormData = useAnnouncementForRentFormStore((s) => s.sendFormData);

  const documentFiles =
    documentIds?.map((id) => {
      return { id, uri: '', type: 'application/pdf' };
    }) || [];

  const handleDocumentIdsChange = (
    attachments: { id: string; uri: string; type?: string; name?: string }[]
  ) => {
    const documentIds = attachments.map((attachment) => attachment.id);
    update({ formData: { documentIds } });
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
        secondButtonLabel={t('common.save_and_exit')}
        onNextPress={nextStep}
        onSaveAndExitPress={handleSaveAndExit}
      />
    </ThemedView>
  );
}
