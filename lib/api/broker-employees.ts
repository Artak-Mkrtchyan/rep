import type {
  BrokerEmployee,
  CreateBrokerEmployeeRequest,
  SearchBrokerEmployeesRequest,
} from '@/types/brokers';
import type { SearchResponse } from '@/types/applications';
import { ApiResponse } from './auth.types';
import { httpClient } from './http/client';

export const brokerEmployeesService = {
  createEmployee: async (data: CreateBrokerEmployeeRequest): Promise<BrokerEmployee> => {
    const response = await httpClient.post<ApiResponse<BrokerEmployee>>(
      '/v1/brokers/companies/employees',
      data,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as BrokerEmployee);
  },

  searchEmployees: async (
    data: SearchBrokerEmployeesRequest
  ): Promise<SearchResponse<BrokerEmployee>> => {
    const response = await httpClient.post<ApiResponse<SearchResponse<BrokerEmployee>>>(
      '/v1/brokers/companies/employees/search',
      data,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as SearchResponse<BrokerEmployee>);
  },
};
