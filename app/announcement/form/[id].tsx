import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, View } from 'react-native';

export default function AnnouncementFormScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const resetForm = useAnnouncementForRentFormStore((s) => s.resetForm);
  const getApplicationById = useAnnouncementForRentFormStore((s) => s.getApplicationById);

  useEffect(() => {
    async function initialize() {
      try {
        if (id === 'new') {
          resetForm();
          router.replace(ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path);
        } else if (id) {
          await getApplicationById(id);
          router.replace(ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path);
        } else {
          router.back();
        }
      } catch {
        Alert.alert(t('common.error'), t('error.failed_to_load_application'));
        router.back();
      }
    }

    initialize();
  }, [id, resetForm, getApplicationById, t]);

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  );
}
