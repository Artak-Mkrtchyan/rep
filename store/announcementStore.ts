import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { RentForApartmentsForm } from '../types/announcement';

const PERSIST_KEY = 'announcement-rent-form-three';

type PersistedState = {
  formData: RentForApartmentsForm;
};

interface AnnouncementForRentFormStore {
  formData: RentForApartmentsForm;
  nextStep: () => void;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<RentForApartmentsForm>) => void;
  resetForm: () => void;
}

const initialFormData: RentForApartmentsForm = {
  listingType: 'FOR_RENT',
  geo: {
    country: '',
    formattedAddress: '',
    locality: '',
    province: '',
    street: '',
  },
  propertyType: 'HOUSE',
  processType: 'AS_INDIVIDUAL',
  stepNumber: 1,
};

export const useAnnouncementForRentFormStore = create<AnnouncementForRentFormStore>()(
  persist(
    subscribeWithSelector((set) => ({
      formData: initialFormData,

      setCurrentStep: (step) =>
        set((state) => ({
          formData: { ...state.formData, stepNumber: step },
        })),

      nextStep: () =>
        set((state) => ({
          formData: { ...state.formData, stepNumber: ++state.formData.stepNumber },
        })),

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
