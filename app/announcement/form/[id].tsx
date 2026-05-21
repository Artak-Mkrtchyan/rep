import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, View } from 'react-native';

const EDITABLE_STATUSES = ['DRAFT', 'RETURNED_TO_APPLICANT', 'ACTIVE'];

/**
 * Ordered screen names for each step of the rent/sale flow. Used when resuming
 * a draft so we can populate the navigation stack with every prior step,
 * letting the user press "back" to move one step at a time through their history.
 */
const getStepScreenChain = (savedStep: number, listingType?: string): string[] => {
  const step4 =
    listingType === 'FOR_SALE'
      ? ANNOUNCEMENT_ROUTES.RENT_SALE_DETAILS.name
      : ANNOUNCEMENT_ROUTES.RENT_RENT_DETAILS.name;
  const chain = [
    ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.name,
    ANNOUNCEMENT_ROUTES.RENT_ANNOUNCEMENT_TITLE.name,
    ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_FIRST.name,
    step4,
    ANNOUNCEMENT_ROUTES.RENT_MEDIA_FIRST.name,
    ANNOUNCEMENT_ROUTES.RENT_CHARACTERISTICS.name,
    ANNOUNCEMENT_ROUTES.RENT_FINAL.name,
  ];
  return chain.slice(0, Math.min(Math.max(savedStep, 1), chain.length));
};

export default function AnnouncementFormScreen() {
  const { t } = useTranslation();
  const { id, isAnnouncement } = useLocalSearchParams<{ id?: string; isAnnouncement?: string }>();
  const resetForm = useAnnouncementForRentFormStore((s) => s.resetForm);
  const getApplicationById = useAnnouncementForRentFormStore((s) => s.getApplicationById);
  const getAnnouncementById = useAnnouncementForRentFormStore((s) => s.getAnnouncementById);
  const navigation = useNavigation();

  const getFormData = isAnnouncement === 'true' ? getAnnouncementById : getApplicationById;

  useEffect(() => {
    async function initialize() {
      try {
        if (id === 'new') {
          resetForm();
          router.replace(ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path);
        } else if (id) {
          await getFormData(id);
          const store = useAnnouncementForRentFormStore.getState();
          const statusCode = store.metaData?.response?.status?.code;
          const isEditable = !statusCode || EDITABLE_STATUSES.includes(statusCode);

          if (!isEditable) {
            // Read-only published apps — force step to final so in-flow navigation
            // can't rewind into an earlier form screen.
            store.setCurrentStep(ANNOUNCEMENT_ROUTES.RENT_FINAL.completedStep);
            router.replace(ANNOUNCEMENT_ROUTES.RENT_FINAL.path);
            return;
          }

          // Resume editable drafts: seed the stack with every step up to the one
          // the user last reached, so pressing back walks through their history.
          const savedStep = store.formData.stepNumber || 1;
          const chain = getStepScreenChain(savedStep, store.formData.listingType);
          const nav = navigation as unknown as {
            reset: (state: { index: number; routes: { name: string }[] }) => void;
          };
          nav.reset({
            index: chain.length - 1,
            routes: chain.map((name) => ({ name })),
          });
        } else {
          router.back();
        }
      } catch {
        Alert.alert(t('common.error'), t('error.failed_to_load_application'));
        router.back();
      }
    }

    initialize();
  }, [id, resetForm, getFormData, navigation, t]);

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  );
}
