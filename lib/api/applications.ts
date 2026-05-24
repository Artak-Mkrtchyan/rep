import type {
  Attributes,
  GeoDetailsDto,
  ListingType,
  ProcessType,
  Property,
  RentForApartmentsForm,
} from '@/types/announcement';

import { InfrastructureObjectType } from '@/lib/api/infrastructure';
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

export interface ApplicationStatusChange {
  applicationId: string;
  createdAt: string;
  createdBy: {
    fullName: string;
    id: string;
  };
  type: string;
  comment?: string;
  currentStatus?: {
    code: ApplicationStatusType;
    name: string;
  };
  previousStatus?: {
    code: ApplicationStatusType;
    name: string;
  };
}

export interface ApplicationHistoryFilter {
  applicationId?: string;
  ids?: string[];
  types?: string[];
  _and_?: ApplicationHistoryFilter[];
  _or_?: ApplicationHistoryFilter[];
  _not_?: ApplicationHistoryFilter;
}

export interface SearchApplicationHistoryRequest {
  filter?: ApplicationHistoryFilter;
  pagination?: { pageNumber?: number; pageSize?: number };
  sorts?: { sort: string; direction: 'ASC' | 'DESC' }[];
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

export interface AnnouncementPublicationListResponse {
  announcementCreatedBy?: {
    fullName: string;
    id: string;
    scope?: string;
    avatarInfo?: {
      id: string;
      url: string;
      thumbnailUrl: string;
    };
  };
  assignedBroker?: {
    fullName: string;
    id: string;
    avatarInfo?: {
      id: string;
      url: string;
      thumbnailUrl: string;
    };
  };
  assignedBrokerCompany?: {
    id: string;
    name: string;
    avatarInfo?: {
      id: string;
      url: string;
      thumbnailUrl: string;
    };
  };
  createdAt: string;
  createdBy?: {
    fullName: string;
    id: string;
    scope?: string;
    avatarInfo?: {
      id: string;
      url: string;
      thumbnailUrl: string;
    };
  };
  firstMediaFile?: {
    thumbnailUrl?: string;
    url?: string;
  };
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
  id: string;
  listingType: ListingType;
  publicId: string;
  rentDetails: {
    monthlyRent: number;
    securityDeposit: number;
  };
  saleDetails: {
    price: number;
  };
  status: {
    code: ApplicationStatusType;
    name: string;
  };
  title: string;
  type: 'ANNOUNCEMENT_PUBLICATION';
  updatedAt: string;
}

/** Response for POST /api/v1/applications/announcement-publication */
export interface AnnouncementPublicationResponse {
  applicantEmail: string;
  createdAt: string;

  brokerAssignmentNeeded: boolean;
  createdBy: string;
  id: string;
  reviewerId: string;
  status: ApplicationStatus;
  type: 'ANNOUNCEMENT_PUBLICATION';
  assignedBrokerCompanyId: string;
  assignedBrokerId: string;

  infrastructureObjects?: {
    distanceInMeters: number;
    type: InfrastructureObjectType;
  }[];
  description: string;
  documents?: {
    createdAt: string;
    fileName: string;
    fileType: string;
    id: string;
    sizeInBytes: number;
    thumbnailUrl?: string;
    url?: string;
  }[];
  geo: GeoDetailsDto;
  initiallySubmittedAt: string;
  listingType: ListingType;
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
  processType: ProcessType;
  property: {
    areaM2: number;
    attributes: Attributes;
    description: string;
    propertyType: Property;
  };
  propertyType: Property;
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

export interface CreateAnnouncementModificationFormApiRequest {
  announcementId: string;
  description?: string;
  documentIds?: string[];
  mediaFileIds?: string[];
  rentDetails?: {
    monthlyRent: number;
    securityDeposit?: number;
  };
  saleDetails?: { price: number };
  stepNumber: number;
  title?: string;
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
      { requiresAuth: false }
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
      { requiresAuth: false }
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
  ): Promise<SearchResponse<AnnouncementPublicationListResponse>> => {
    const response = await httpClient.post<
      ApiResponse<SearchResponse<AnnouncementPublicationListResponse>>
    >(`/v1/applications/search/for-screen/my-announcement-applications`, data, {
      requiresAuth: true,
    });
    return (
      response.data || (response as unknown as SearchResponse<AnnouncementPublicationListResponse>)
    );
  },

  /**
   * Get statistics for applications in different statuses
   * @returns A promise that resolves to application statistics by status
   */
  getApplicationStatisticsByStatuses: async (
    data: any
  ): Promise<ApplicationStatisticsByStatusResponse> => {
    const response = await httpClient.post<ApiResponse<ApplicationStatisticsByStatusResponse>>(
      `/v1/applications/statistics/by-statuses`,
      data,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as ApplicationStatisticsByStatusResponse);
  },

  /**
   * Get application by ID
   * @param id Application ID
   * @returns A promise that resolves to the application data
   */
  getApplicationById: async (id: string): Promise<AnnouncementPublicationResponse> => {
    const response = await httpClient.get<ApiResponse<AnnouncementPublicationResponse>>(
      `/v1/applications/${id}`,
      {
        requiresAuth: true,
      }
    );
    return response.data || (response as unknown as AnnouncementPublicationResponse);
  },

  /**
   * Creates a new announcement modification application
   * @param data The data for creating the announcement modification application
   * @returns A promise that resolves to the created application data
   */
  createAnnouncementModificationApplication: async (
    data: CreateAnnouncementModificationFormApiRequest
  ): Promise<ApplicationDetails> => {
    const response = await httpClient.post<ApiResponse<ApplicationDetails>>(
      `/v1/applications/announcement-modification`,
      data,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as ApplicationDetails);
  },

  /**
   * Submit announcement modification application for moderator review
   * @param id Application ID
   * @returns A promise that resolves to the updated application data
   */
  publishAnnouncementModificationApplication: async (id: string): Promise<never> => {
    const response = await httpClient.patch<ApiResponse<never>>(
      `/v1/applications/announcement-modification/${id}/submit`,
      {},
      { requiresAuth: true }
    );
    return response.data || (response as unknown as never);
  },

  /**
   * Delete draft application
   * @param id Application ID
   * @param type Application type ('ANNOUNCEMENT_PUBLICATION' or 'ANNOUNCEMENT_MODIFICATION')
   */
  deleteApplication: async (
    id: string,
    type: 'ANNOUNCEMENT_PUBLICATION' | 'ANNOUNCEMENT_MODIFICATION'
  ): Promise<void> => {
    const typeSlug =
      type === 'ANNOUNCEMENT_PUBLICATION'
        ? 'announcement-publication'
        : 'announcement-modification';
    await httpClient.delete<void>(`/v1/applications/${typeSlug}/${id}`, undefined, {
      requiresAuth: true,
    });
  },

  /**
   * Search application history (status changes, comments, etc)
   * POST /api/v1/applications/history/search/for-screen/application-timeline
   */
  searchApplicationHistory: async (
    params: SearchApplicationHistoryRequest = {}
  ): Promise<SearchResponse<ApplicationStatusChange>> => {
    const response = await httpClient.post<ApiResponse<SearchResponse<ApplicationStatusChange>>>(
      '/v1/applications/history/search/for-screen/application-timeline',
      params,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as SearchResponse<ApplicationStatusChange>);
  },

  /**
   * Get application full info by ID (including owner and broker contact info)
   * GET /api/v1/applications/{id}/full-info
   */
  getApplicationFullInfo: async (id: string): Promise<ApplicationFullInfoDto> => {
    const response = await httpClient.get<ApiResponse<ApplicationFullInfoDto>>(
      `/v1/applications/${id}/full-info`,
      {
        requiresAuth: true,
      }
    );
    return response.data || (response as unknown as ApplicationFullInfoDto);
  },
};

export interface ApplicationFullInfoDto {
  assignedBroker?: {
    id: string;
    fullName: string;
    avatarInfo?: {
      id: string;
      url: string;
      thumbnailUrl: string;
    };
    phoneNumber?: string;
    email?: string;
  };
  createdBy?: {
    id: string;
    fullName: string;
    avatarInfo?: {
      id: string;
      url: string;
      thumbnailUrl: string;
    };
    phone?: string;
    email?: string;
  };
  assignedBrokerCompany?: {
    id: string;
    name: string;
    avatarInfo?: {
      id: string;
      url: string;
      thumbnailUrl: string;
    };
    phoneNumber?: string;
    email?: string;
  };
}
