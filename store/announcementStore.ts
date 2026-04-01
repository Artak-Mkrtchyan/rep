import { applicationsService } from '@/lib/api/applications';
import { MetaData, RentForApartmentsForm } from '@/types/announcement';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';

const PERSIST_KEY = 'announcement-rent-form-v3';

type PersistedState = {
  formData: RentForApartmentsForm;
  metaData?: MetaData;
};

interface AnnouncementForRentFormStore {
  formData: RentForApartmentsForm;
  metaData?: MetaData;
  nextStep: () => void;
  setBrokerId: (id: string) => void;
  sendFormData: () => Promise<{ id: string }>;
  publishFormData: () => Promise<void>;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<RentForApartmentsForm>) => void;
  resetForm: () => void;
}

export const EMPTY_FLAT_GEO = {
  formattedAddress: { ru: '', en: '', uz: '' },
  latitude: undefined,
  longitude: undefined,
  country: { ru: '', en: '', uz: '' },
  house: undefined,
  locality: { ru: '', en: '', uz: '' },
  province: { ru: '', en: '', uz: '' },
  district: { ru: '', en: '', uz: '' },
  street: { ru: '', en: '', uz: '' },
};

const initialFormData: RentForApartmentsForm = {
  listingType: '',
  geo: EMPTY_FLAT_GEO,
  propertyType: '',
  processType: '',
  stepNumber: 1,
};

export const useAnnouncementForRentFormStore = create<AnnouncementForRentFormStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      metaData: undefined,
      formData: initialFormData,

      setCurrentStep: (step) =>
        set((state) => ({
          formData: { ...state.formData, stepNumber: step },
        })),

      setBrokerId: (id) =>
        set((state) => ({
          metaData: { ...state?.metaData, brokerId: id },
        })),

      nextStep: () =>
        set((state) => {
          return {
            formData: { ...state.formData, stepNumber: ++state.formData.stepNumber },
          };
        }),

      sendFormData: async () => {
        try {
          const { formData, metaData } = get();

          if (metaData?.response?.id) {
            await applicationsService.updateAnnouncementPublication(metaData.response.id, formData);
            return { id: metaData.response.id };
          } else {
            const response = await applicationsService.announcementPublication(formData);
            set(() => ({
              metaData: {
                ...metaData,
                response: {
                  id: response.id,
                  status: response.status,
                  createdAt: response.createdAt,
                  createdBy: response.createdBy,
                  applicantEmail: response.applicantEmail,
                  publicId: response.publicId,
                },
              },
            }));
            return { id: response.id };
          }
        } catch (error) {
          throw error;
        }
      },

      publishFormData: async () => {
        try {
          const { metaData } = get();
          if (!metaData?.response?.id) {
            const error = new Error('Save the form first before publishing');
            throw error;
          }
          await applicationsService.publishApplication(metaData.response.id);
        } catch (error) {
          throw error;
        }
      },

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetForm: () =>
        set({
          metaData: undefined,
          formData: initialFormData,
        }),
    })),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        ({
          formData: state.formData,
          metaData: state?.metaData,
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
