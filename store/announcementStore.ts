import { getParsedAnnouncementData } from '@/lib/announcement';
import { applicationsService } from '@/lib/api/applications';
import { MetaData, RentForApartmentsForm } from '@/types/announcement';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AnnouncementForRentFormStore {
  formData: RentForApartmentsForm;
  metaData?: MetaData;
  nextStep: () => void;
  setBrokerId: (id: string) => void;
  sendFormData: () => Promise<{ id: string }>;
  publishFormData: () => Promise<void>;
  setCurrentStep: (step: number) => void;

  getApplicationById: (id: string) => Promise<void>;
  updateFormData: (data: Partial<RentForApartmentsForm>) => void;

  update: ({
    formData,
    metaData,
  }: {
    formData?: Partial<RentForApartmentsForm>;
    metaData?: Partial<MetaData>;
  }) => void;
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

        // Strip null/undefined optional fields that the API may reject
        const payload = { ...formData } as Record<string, unknown>;
        if (!payload.rentDetails) delete payload.rentDetails;
        if (!payload.saleDetails) delete payload.saleDetails;
        if (!payload.documentIds) delete payload.documentIds;
        if (!payload.mediaFileIds) delete payload.mediaFileIds;
        if (!payload.infrastructureObjects) delete payload.infrastructureObjects;

        if (metaData?.response?.id) {
          await applicationsService.updateAnnouncementPublication(
            metaData.response.id,
            payload as RentForApartmentsForm
          );
          return { id: metaData.response.id };
        } else {
          const response = await applicationsService.announcementPublication(
            payload as RentForApartmentsForm
          );
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

    getApplicationById: async (id: string) => {
      try {
        const response = await applicationsService.getApplicationById(id);

        const { formData, metaData } = getParsedAnnouncementData(response);

        set(() => ({
          formData,
          metaData,
        }));
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

    update: ({ formData, metaData }) =>
      set((state) => ({
        formData: { ...state.formData, ...formData },
        metaData: { ...state?.metaData, ...metaData },
      })),

    resetForm: () =>
      set({
        metaData: undefined,
        formData: initialFormData,
      }),
  }))
);
