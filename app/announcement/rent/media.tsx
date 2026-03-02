import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FileUpload } from '@/components/ui/file-upload';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';

const SCREEN_TITLE = 'Add photos';
const SCREEN_SUBTITLE = 'Photos help renters imagine living in your place.';

export default function MediaScreen() {
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useAnnouncementForRentFormStore((s) => s.nextStep);
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);

  const mediaFileIds = formData.mediaFileIds ?? [];

  const handlePhotoIdsChange = (ids: string[]) => {
    updateFormData({ mediaFileIds: ids });
  };

  const handleNext = () => {
    nextStep();
  };

  const handleSaveAndExit = async () => {
    await sendFormData();
    router.push('/(tabs)');
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 31 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="px-4 pt-[24px]">
          <ThemedText className="mb-2 text-[20px] font-bold text-foreground">
            {SCREEN_TITLE}
          </ThemedText>
          <ThemedText className="mb-6 text-[14px] text-muted-foreground">
            {SCREEN_SUBTITLE}
          </ThemedText>

          <FileUpload value={mediaFileIds} onChange={handlePhotoIdsChange} />
        </View>
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel="Next"
        secondButtonLabel="Save & exit"
        onNextPress={handleNext}
        onSaveAndExitPress={handleSaveAndExit}
      />
    </ThemedView>
  );
}
