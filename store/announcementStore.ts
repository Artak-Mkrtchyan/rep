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
      const { formData, metaData } = get();

      // Strip fields that the API's PUT endpoint doesn't accept.
      // Web's mapApplicationToApiRequest only sends this subset.
      const payload: Record<string, unknown> = {
        stepNumber: formData.stepNumber,
        listingType: formData.listingType,
        geo: formData.geo,
        propertyType: formData.propertyType,
        brokerAssignmentNeeded: formData.brokerAssignmentNeeded,
        title: formData.title,
        description: formData.description,
        property: formData.property,
        rentDetails: formData.rentDetails,
        saleDetails: formData.saleDetails,
        // Always send arrays (never null/undefined) — the backend crashes with a
        // NullPointerException on getDocumentIds().stream() if these are omitted.
        mediaFileIds: formData.mediaFileIds ?? [],
        documentIds: formData.documentIds ?? [],
        infrastructureObjects: formData.infrastructureObjects ?? [],
      };

      // Strip undefined/null optional fields, but preserve array fields even when empty
      const ALWAYS_SEND = new Set(['mediaFileIds', 'documentIds', 'infrastructureObjects']);
      Object.keys(payload).forEach((k) => {
        if (ALWAYS_SEND.has(k)) return;
        if (payload[k] === undefined || payload[k] === null) delete payload[k];
      });

      console.log(
        '[announcementStore.sendFormData] payload:',
        JSON.stringify(payload, null, 2)
      );

      if (metaData?.response?.id) {
        console.log(
          '[announcementStore.sendFormData] updating id:',
          metaData.response.id
        );
        try {
          await applicationsService.updateAnnouncementPublication(
            metaData.response.id,
            payload as RentForApartmentsForm
          );
        } catch (error) {
          console.error(
            '[announcementStore.sendFormData] PUT failed:',
            JSON.stringify(error, Object.getOwnPropertyNames(error as object), 2)
          );
          throw error;
        }
        return { id: metaData.response.id };
      } else {
        console.log('[announcementStore.sendFormData] creating new application');
        let response;
        try {
          response = await applicationsService.announcementPublication(
            payload as RentForApartmentsForm
          );
        } catch (error) {
          console.error(
            '[announcementStore.sendFormData] POST failed:',
            JSON.stringify(error, Object.getOwnPropertyNames(error as object), 2)
          );
          throw error;
        }
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
      const { metaData } = get();
      if (!metaData?.response?.id) {
        const error = new Error('Save the form first before publishing');
        console.error('[announcementStore.publishFormData] missing application id');
        throw error;
      }
      console.log(
        '[announcementStore.publishFormData] submitting id:',
        metaData.response.id
      );
      try {
        await applicationsService.publishApplication(metaData.response.id);
        console.log('[announcementStore.publishFormData] success');
      } catch (error) {
        console.error(
          '[announcementStore.publishFormData] PATCH failed:',
          JSON.stringify(error, Object.getOwnPropertyNames(error as object), 2)
        );
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
