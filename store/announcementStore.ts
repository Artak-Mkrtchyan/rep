import { applicationsService } from '@/lib/api/applications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { RentForApartmentsForm } from '../types/announcement';

const PERSIST_KEY = 'announcement-rent-form-v1';

type PersistedState = {
  formData: RentForApartmentsForm;
  announcementId?: string;
  publicId?: string;
  brokerId?: string;
};

interface AnnouncementForRentFormStore {
  announcementId?: string;
  publicId?: string;
  brokerId?: string;
  formData: RentForApartmentsForm;
  nextStep: () => void;
  setBrokerId: (id: string) => void;
  sendFormData: () => Promise<void>;
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
      announcementId: undefined,
      publicId: undefined,
      brokerId: undefined,
      formData: initialFormData,

      setCurrentStep: (step) =>
        set((state) => ({
          formData: { ...state.formData, stepNumber: step },
        })),

      setBrokerId: (id) =>
        set(() => ({
          brokerId: id,
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
            set(() => ({
              announcementId: response.id,
              publicId: response.publicId,
            }));
          }
        } catch (error) {
          throw error;
        }
      },

      publishFormData: async () => {
        try {
          const { announcementId } = get();
          if (!announcementId) {
            const error = new Error('Save the form first before publishing');
            throw error;
          }
          await applicationsService.publishApplication(announcementId);
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
          announcementId: undefined,
          publicId: undefined,
          brokerId: undefined,
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
          publicId: state.publicId,
          brokerId: state.brokerId,
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
