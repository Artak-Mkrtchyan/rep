import { AuthScope } from './auth';
import { httpClient } from './http/client';

export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  scope?: AuthScope;
}

export interface IndividualBrokerProfile {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  certifiedOn: string;
  certifiedBy?: string;
  yearsOfActivity: number;
}

export interface BrokerCompanyProfile {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phoneNumber: string;
  certifiedOn: string;
  certifiedBy?: string;
  yearsOfActivity: number;
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface UsualUserUpdateRequest {
  avatarId?: string;
  dateOfBirth?: string;
  fullName?: string;
  phone?: string;
}

export const profileService = {
  getUser: async (id: string): Promise<UserProfile> => {
    const response = await httpClient.get<UserProfile>(`/v1/users/${id}`, {
      requiresAuth: true,
    });
    return response;
  },

  getIndividualBroker: async (id: string): Promise<IndividualBrokerProfile> => {
    const response = await httpClient.get<IndividualBrokerProfile>(
      `/v1/brokers/individuals/${id}`,
      { requiresAuth: true },
    );
    return response;
  },

  getBrokerCompany: async (id: string): Promise<BrokerCompanyProfile> => {
    const response = await httpClient.get<BrokerCompanyProfile>(
      `/v1/brokers/companies/${id}`,
      { requiresAuth: true },
    );
    return response;
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<void> => {
    await httpClient.patch<void>(`/v1/users/${id}`, data, { requiresAuth: true });
  },

  updateUsualUser: async (id: string, data: UsualUserUpdateRequest): Promise<void> => {
    await httpClient.put<void>(`/v1/users/usual/${id}`, data, { requiresAuth: true });
  },
};
