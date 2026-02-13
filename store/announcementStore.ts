import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { RentForApartmentsForm } from '../types/announcement';

const PERSIST_KEY = 'announcement-rent-form';

type PersistedState = {
  formData: RentForApartmentsForm;
  currentStep: number;
  completedSteps: number[];
};

interface AnnouncementForRentFormStore {
  // Form data
  formData: RentForApartmentsForm;

  // Step management
  currentStep: number;
  completedSteps: Set<number>;

  // TanStack Form instances for each step
  stepFormInstances: Record<number, any>;

  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<RentForApartmentsForm>) => void;
  registerStepForm: (step: number, formInstance: any) => void;
  markStepComplete: (step: number) => void;
  markStepIncomplete: (step: number) => void;

  // Reset
  resetForm: () => void;
}

const initialFormData: RentForApartmentsForm = {
  listingType: '',
  address: '',
  propertyType: '',
  processAnnouncement: '',
  needPhotographer: false,
  needAssessmentExpert: false,
  photographerDateTime: '',
  assessmentExpertDateTime: '',
  title: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  description: '',
  monthlyRent: '',
  securityDeposit: '',
  numberOfFloors: '',
  floorNo: '',
  buildingType: '',
  condition: '',
  yearBuilt: '',
  ownershipType: '',
  mediaFileIds: [],
};

export const useAnnouncementForRentFormStore = create<AnnouncementForRentFormStore>()(
  persist(
    subscribeWithSelector((set) => ({
      formData: initialFormData,
      currentStep: 1,
      completedSteps: new Set<number>(),
      stepFormInstances: {},

      setCurrentStep: (step) => set({ currentStep: step }),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      registerStepForm: (step, formInstance) =>
        set((state) => ({
          stepFormInstances: { ...state.stepFormInstances, [step]: formInstance },
        })),

      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: new Set([...state.completedSteps, step]),
        })),

      markStepIncomplete: (step) =>
        set((state) => {
          const newCompleted = new Set(state.completedSteps);
          newCompleted.delete(step);
          return { completedSteps: newCompleted };
        }),

      resetForm: () =>
        set({
          formData: initialFormData,
          currentStep: 1,
          completedSteps: new Set<number>(),
          stepFormInstances: {},
        }),
    })),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        ({
          formData: state.formData,
          currentStep: state.currentStep,
          completedSteps: [...state.completedSteps],
        }) as PersistedState,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as PersistedState | undefined;
        if (!persisted || typeof persisted !== 'object') {
          return currentState;
        }
        return {
          ...currentState,
          ...persisted,
          completedSteps: new Set<number>(persisted.completedSteps ?? []),
        };
      },
    }
  )
);
