import type { RentForApartmentsForm } from '@/types/announcement';

import { ApiResponse } from './auth.types';
import { httpClient } from './http/client';

export interface TemporaryAttachmentResponse {
  id: string;
}

export interface BrokerRegistrationRequest {
  attachmentIds: string[];
  certifiedBy: string;
  certifiedOn: string; // ISO date string: "2026-01-17"
  email: string;
  fullName: string;
  phoneNumber: string;
  yearsOfActivity: number;
}

export interface ApplicationStatus {
  code: string; // e.g., "DRAFT"
  name: string;
}

export interface BrokerRegistrationResponse {
  id: string;
  applicantEmail: string;
  createdAt: string; // ISO datetime string
  createdBy: string;
  reviewerId?: string;
  status: ApplicationStatus;
  type: string; // e.g., "ANNOUNCEMENT_PUBLICATION"
  brokerId?: string;
  certifiedBy: string;
  certifiedOn: string; // ISO date string
  fullName: string;
  phoneNumber: string;
  yearsOfActivity: number;
}

export interface CompanyInfo {
  certifiedBy?: string;
  certifiedOn: string; // ISO date string: "2026-01-29"
  email: string;
  name: string;
  phoneNumber: string;
  yearsOfActivity: number;
}

export interface ManagerInfo {
  email: string;
  fullName: string;
  phoneNumber: string;
}

export interface BrokerCompanyRegistrationRequest {
  attachmentIds: string[];
  companyInfo: CompanyInfo;
  managerInfo: ManagerInfo;
}

export interface BrokerCompanyRegistrationResponse {
  id: string;
  applicantEmail: string;
  createdAt: string; // ISO datetime string
  createdBy: string;
  reviewerId?: string;
  status: ApplicationStatus;
  type: string; // e.g., "ANNOUNCEMENT_PUBLICATION"
  companyInfo: CompanyInfo;
  managerInfo: ManagerInfo;
}

export interface ConstructionCompanyRegistrationRequest {
  attachmentIds: string[];
  companyInfo: {
    certifiedBy?: string;
    certifiedOn: string;
    name: string;
    email: string;
    phoneNumber: string;
    yearsOfActivity: number;
  };
  managerInfo: {
    email?: string;
    fullName: string;
    phoneNumber?: string;
  };
}

export interface ConstructionCompanyRegistrationResponse {
  id: string;
  applicantEmail: string;
  createdAt: string;
  createdBy: string;
  reviewerId?: string;
  status: ApplicationStatus;
  type: string;
  companyInfo: CompanyInfo;
  managerInfo: ManagerInfo;
}

export type FileInput = { uri: string; type: string; name: string }; // React Native format

/** Response for POST /api/v1/applications/announcement-publication */
export interface AnnouncementPublicationResponse {
  applicantEmail: string;
  createdAt: string;
  createdBy: string;
  id: string;
  reviewerId: string;
  status: ApplicationStatus;
  type: 'ANNOUNCEMENT_PUBLICATION';
  assignedBrokerCompanyId: string;
  assignedBrokerId: string;
  description: string;
  documentIds: string[];
  geo: {
    country: string;
    district: string;
    formattedAddress: string;
    house: string;
    latitude: number;
    locality: string;
    longitude: number;
    province: string;
    street: string;
  };
  initiallySubmittedAt: string;
  listingType: string;
  mediaFiles: {
    createdAt: string;
    fileName: string;
    fileType: string;
    id: string;
    sizeInBytes: number;
    thumbnailUrl: string;
    url: string;
  }[];
  needAssessmentExpert: boolean;
  needPhotographer: boolean;
  processType: string;
  property: {
    areaM2: number;
    attributes: Record<string, unknown>;
    description: string;
    propertyType: string;
  };
  propertyType: string;
  publicId: string;
  publishedAnnouncementId: string;
  rentDetails: {
    monthlyRent: number;
    securityDeposit: number;
  };
  saleDetails: {
    price: number;
  };
  stepNumber: number;
  title: string;
}

export const applicationsService = {
  /**
   * Upload a temporary attachment file
   * @param file - File to upload (FormData)
   * @returns Temporary attachment response with ID
   */
  uploadTemporaryAttachment: async (file: FormData): Promise<TemporaryAttachmentResponse> => {
    const response = await httpClient.post<ApiResponse<TemporaryAttachmentResponse>>(
      '/v1/applications/temporary-attachments',
      file,
      {
        skipAuth: true,
      }
    );

    return response.data || (response as unknown as TemporaryAttachmentResponse);
  },

  /**
   * Register a broker application
   * @param data - Broker registration data
   * @returns Broker registration response with application details
   */
  brokerRegistration: async (
    data: BrokerRegistrationRequest
  ): Promise<BrokerRegistrationResponse> => {
    const response = await httpClient.post<ApiResponse<BrokerRegistrationResponse>>(
      '/v1/applications/individual-broker-registration',
      data,
      {
        skipAuth: true,
      }
    );

    return response.data || (response as unknown as BrokerRegistrationResponse);
  },

  /**
   * Register a broker company application
   * @param data - Broker company registration data
   * @returns Broker company registration response with application details
   */
  brokerCompanyRegistration: async (
    data: BrokerCompanyRegistrationRequest
  ): Promise<BrokerCompanyRegistrationResponse> => {
    const response = await httpClient.post<ApiResponse<BrokerCompanyRegistrationResponse>>(
      '/v1/applications/broker-company-registration',
      data,
      {
        skipAuth: true,
      }
    );

    return response.data || (response as unknown as BrokerCompanyRegistrationResponse);
  },

  /**
   * Register a construction company application
   * @param data - Construction company registration data
   * @returns Construction company registration response with application details
   */
  constructionCompanyRegistration: async (
    data: ConstructionCompanyRegistrationRequest
  ): Promise<ConstructionCompanyRegistrationResponse> => {
    const response = await httpClient.post<ApiResponse<ConstructionCompanyRegistrationResponse>>(
      '/v1/applications/construction-company-registration',
      data,
      {
        skipAuth: true,
      }
    );

    return response.data || (response as unknown as ConstructionCompanyRegistrationResponse);
  },

  /**
   * Submit announcement publication application
   * @param data - RentForApartmentsForm (full form data from announcement flow)
   * @returns Announcement publication application response
   */
  announcementPublication: async (
    data: RentForApartmentsForm
  ): Promise<AnnouncementPublicationResponse> => {
    const response = await httpClient.post<ApiResponse<AnnouncementPublicationResponse>>(
      '/v1/applications/announcement-publication',
      data
    );

    return response.data ?? (response as unknown as AnnouncementPublicationResponse);
  },

  /**
   * Update announcement publication application by id
   * @param id - Application id
   * @param data - RentForApartmentsForm (full form data from announcement flow)
   * @returns Resolves on 200 success
   */
  updateAnnouncementPublication: async (id: string, data: RentForApartmentsForm): Promise<void> => {
    await httpClient.put<void>(
      `/v1/applications/announcement-publication/${encodeURIComponent(id)}`,
      data
    );
  },

  /**
   * Submit application for moderator review
   * @param id Application ID
   * @returns A promise that resolves to the updated application data
   */
  publishApplication: async (id: string): Promise<AnnouncementPublicationResponse> => {
    const response = await httpClient.patch<ApiResponse<AnnouncementPublicationResponse>>(
      `/v1/applications/announcement-publication/${id}/submit`,
      {},
      { requiresAuth: true }
    );
    return response.data || (response as unknown as AnnouncementPublicationResponse);
  },
};
