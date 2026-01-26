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

export type FileInput = { uri: string; type: string; name: string }; // React Native format

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
      '/v1/applications/broker-registration',
      data,
      {
        skipAuth: true,
      }
    );

    return response.data || (response as unknown as BrokerRegistrationResponse);
  },
};
