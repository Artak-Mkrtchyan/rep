import { getParsedAnnouncementData, getParsedApplicationData } from '@/lib/announcement';
import { announcementsService } from '@/lib/api/announcements';
import {
  applicationsService,
  CreateAnnouncementModificationFormApiRequest,
} from '@/lib/api/applications';
import { MetaData, RentForApartmentsForm } from '@/types/announcement';
import { CreateAnnouncementUpdateRequest } from '@/types/my-announcements';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AnnouncementForRentFormStore {
  formData: RentForApartmentsForm;
  metaData?: MetaData;
  nextStep: () => number;
  setBrokerId: (id: string) => void;
  sendFormData: () => Promise<{ id: string }>;
  publishFormData: () => Promise<void>;
  setCurrentStep: (step: number) => void;

  getApplicationById: (id: string) => Promise<void>;
  getAnnouncementById: (id: string) => Promise<void>;
  updateFormData: (data: Partial<RentForApartmentsForm>) => void;
  createAnnouncementModificationApplication: () => Promise<string | undefined>;
  publishAnnouncementModificationApplication: (id: string) => Promise<void>;
  updateAnnouncement: () => Promise<void>;

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

    nextStep: () => {
      let newStep = 0;
      set((state) => {
        newStep = state.formData.stepNumber + 1;
        return {
          formData: { ...state.formData, stepNumber: newStep },
        };
      });
      return newStep;
    },

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
        // Match web: only send the deal-detail block matching listingType.
        rentDetails: formData.listingType === 'FOR_RENT' ? formData.rentDetails : undefined,
        saleDetails: formData.listingType === 'FOR_SALE' ? formData.saleDetails : undefined,
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
    },

    getApplicationById: async (id: string) => {
      try {
        const response = await applicationsService.getApplicationById(id);

        const { formData, metaData } = getParsedApplicationData(response);

        let applicationComment: string | undefined;
        const statusCode = response.status?.code;
        if (statusCode === 'RETURNED_TO_APPLICANT' || statusCode === 'REJECTED') {
          try {
            const historyResponse = await applicationsService.searchApplicationHistory({
              filter: {
                applicationId: id,
                types: ['application-status-changed'],
              },
              pagination: {
                pageNumber: 0,
                pageSize: 1,
              },
              sorts: [
                {
                  sort: 'CREATED_AT',
                  direction: 'DESC',
                },
              ],
            });
            applicationComment = historyResponse.content?.[0]?.comment;
          } catch (historyError) {
            console.error('Failed to load application history comment:', historyError);
          }
        }

        set(() => ({
          formData,
          metaData: {
            ...metaData,
            applicationComment,
          },
        }));
      } catch (error) {
        throw error;
      }
    },

    getAnnouncementById: async (id: string) => {
      try {
        const response = await announcementsService.getAnnouncementById(id);

        const { formData, metaData } = getParsedAnnouncementData(response);

        set(() => ({
          formData,
          metaData,
        }));
      } catch (error) {
        throw error;
      }
    },

    updateAnnouncement: async () => {
      const { formData, metaData } = get();

      const payload: CreateAnnouncementUpdateRequest = {
        property: formData.property,
        mediaFileIds: formData.mediaFileIds,
        documentIds: formData.documentIds,
      };

      const id = metaData?.response?.id;

      if (id) {
        await announcementsService.updateAnnouncementWithoutModeration(id, payload);
      }
    },

    createAnnouncementModificationApplication: async () => {
      try {
        const { formData, metaData } = get();

        const announcementId = metaData?.response?.id;

        if (announcementId) {
          const payload: CreateAnnouncementModificationFormApiRequest = {
            announcementId,
            description: formData.description,
            documentIds: formData.documentIds,
            mediaFileIds: formData.mediaFileIds,
            rentDetails: formData.listingType === 'FOR_RENT' ? formData.rentDetails : undefined,
            saleDetails: formData.listingType === 'FOR_SALE' ? formData.saleDetails : undefined,
            stepNumber: formData.stepNumber,
            title: formData.title,
          };

          const response =
            await applicationsService.createAnnouncementModificationApplication(payload);

          return response.id;
        }
      } catch (error) {
        throw error;
      }
    },

    publishAnnouncementModificationApplication: async (id: string) => {
      try {
        await applicationsService.publishAnnouncementModificationApplication(id);
      } catch (error) {
        throw error;
      }
    },

    publishFormData: async () => {
      const { metaData } = get();
      if (!metaData?.response?.id) {
        throw new Error('Save the form first before publishing');
      }
      await applicationsService.publishApplication(metaData.response.id);
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
