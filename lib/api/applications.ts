import type { RentForApartmentsForm } from '@/types/announcement';

import {
  ApplicationDetails,
  ApplicationStatisticsByStatusResponse,
  AssignBrokerRequest,
  BrokerCompany,
  IndividualBroker,
  SearchRequest,
  SearchResponse,
} from '@/types/applications';
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

export type ApplicationStatusType =
  | 'DRAFT'
  | 'APPROVED'
  | 'COMPLETED'
  | 'RETURNED_TO_APPLICANT'
  | 'UNDER_REVIEW'
  | 'SUBMITTED'
  | 'REJECTED';

export interface ApplicationStatus {
  code: ApplicationStatusType; // e.g., "DRAFT"
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

  /**
   * Search broker companies
   * @param data Search parameters
   * @returns A promise that resolves to the search results for broker companies.
   */
  searchBrokerCompanies: async (data: SearchRequest): Promise<SearchResponse<BrokerCompany>> => {
    const response = await httpClient.post<ApiResponse<SearchResponse<BrokerCompany>>>(
      `/v1/brokers/companies/search`,
      data,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as SearchResponse<BrokerCompany>);
  },
  /**
   * Search individual brokers
   * @param data Search parameters
   * @returns A promise that resolves to the search results for individual brokers.
   */
  searchIndividualBrokers: async (
    data: SearchRequest
  ): Promise<SearchResponse<IndividualBroker>> => {
    const response = await httpClient.post<ApiResponse<SearchResponse<IndividualBroker>>>(
      `/v1/brokers/individuals/search`,
      data,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as SearchResponse<IndividualBroker>);
  },

  // TODO: check the API response structure and adjust the return type accordingly
  getIndividualBrokerById: async (id: string): Promise<IndividualBroker> => {
    const response = await httpClient.get<ApiResponse<IndividualBroker>>(
      `/v1/brokers/individuals/${id}`,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as IndividualBroker);
  },

  // TODO: check the API response structure and adjust the return type accordingly
  getBrokerCompanyById: async (id: string): Promise<BrokerCompany> => {
    const response = await httpClient.get<ApiResponse<BrokerCompany>>(
      `/v1/brokers/companies/${id}`,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as BrokerCompany);
  },

  /**
   * Assign broker to announcement publication application
   * @param id Application ID
   * @param data Broker assignment data (brokerCompanyId or brokerId)
   * @returns A promise that resolves to the updated application data
   */
  assignBroker: async (id: string, data: AssignBrokerRequest): Promise<ApplicationDetails> => {
    const response = await httpClient.patch<ApiResponse<ApplicationDetails>>(
      `/v1/applications/announcement-publication/${id}/assign-broker`,
      data,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as ApplicationDetails);
  },

  /**
   * Download media file (photo/video) of application by id
   * @param applicationId Application ID
   * @param fileId Media file ID
   * @param thumbnail Whether to download thumbnail version
   * @returns A promise that resolves to the file blob
   */
  downloadApplicationMediaFile: async (
    applicationId: string,
    fileId: string,
    thumbnail: boolean = false
  ): Promise<Blob> => {
    const url = `/v1/applications/announcement-publication/${applicationId}/media-files/${fileId}/download${thumbnail ? '?thumbnail=true' : ''}`;
    const response = await httpClient.getFile(url, {
      requiresAuth: true,
    });
    return response;
  },
  /**
   * Retrieves a list of applications for the current user, optionally filtered by type and paginated.
   * @param data An object containing optional filter, page, and pageSize parameters to customize the query.
   * @returns A promise that resolves to an object containing the list of applications, total count, pagination info, and counts by status.
   */
  getMyApplications: async (
    data: SearchRequest
  ): Promise<SearchResponse<AnnouncementPublicationResponse>> => {
    const response = await httpClient.post<
      ApiResponse<SearchResponse<AnnouncementPublicationResponse>>
    >(`/v1/applications/search/for-screen/my-announcement-applications`, data, {
      requiresAuth: true,
    });
    return (
      response.data || (response as unknown as SearchResponse<AnnouncementPublicationResponse>)
    );
  },

  /**
   * Get statistics for applications in different statuses
   * @returns A promise that resolves to application statistics by status
   */
  getApplicationStatisticsByStatuses: async (): Promise<ApplicationStatisticsByStatusResponse> => {
    const response = await httpClient.post<ApiResponse<ApplicationStatisticsByStatusResponse>>(
      `/v1/applications/statistics/by-statuses`,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as ApplicationStatisticsByStatusResponse);
  },
};
