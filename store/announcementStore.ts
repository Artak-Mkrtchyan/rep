import { applicationsService } from '@/lib/api/applications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { RentForApartmentsForm } from '../types/announcement';

const PERSIST_KEY = 'announcement-rent-form-five';

type PersistedState = {
  formData: RentForApartmentsForm;
  announcementId?: string;
};

interface AnnouncementForRentFormStore {
  announcementId?: string;
  formData: RentForApartmentsForm;
  nextStep: () => void;
  sendFormData: () => Promise<void>;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<RentForApartmentsForm>) => void;
  resetForm: () => void;
}

const initialFormData: RentForApartmentsForm = {
  listingType: '',
  geo: {
    country: '',
    formattedAddress: '',
    locality: '',
    province: '',
    street: '',
  },
  propertyType: '',
  processType: '',
  stepNumber: 1,
};

export const useAnnouncementForRentFormStore = create<AnnouncementForRentFormStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      announcementId: undefined,
      formData: initialFormData,

      setCurrentStep: (step) =>
        set((state) => ({
          formData: { ...state.formData, stepNumber: step },
        })),

      nextStep: () =>
        set((state) => {
          return {
            formData: { ...state.formData, stepNumber: ++state.formData.stepNumber },
          };
        }),

      sendFormData: async () => {
        try {
          const { formData, announcementId } = get();

          if (announcementId) {
            await applicationsService.updateAnnouncementPublication(announcementId, formData);
          } else {
            const response = await applicationsService.announcementPublication(formData);
            set((state) => {
              return {
                announcementId: response.id,
                formData: { ...state.formData, response },
              };
            });
          }
        } catch {
          Alert.alert('Error', 'Failed to send form data');
        }
      },

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetForm: () =>
        set({
          formData: initialFormData,
        }),
    })),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        ({
          formData: state.formData,
          announcementId: state.announcementId,
        }) as PersistedState,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as PersistedState | undefined;
        if (!persisted || typeof persisted !== 'object') {
          return currentState;
        }
        return {
          ...currentState,
          ...persisted,
        };
      },
    }
  )
);
