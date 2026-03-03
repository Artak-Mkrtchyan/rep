import { ApiResponse } from './auth.types';
import { AuthScope } from './auth';
import { httpClient } from './http/client';

export interface UserExistsResponse {
  exists: boolean;
}

export const usersService = {
  checkUserExists: async (email: string, scope: AuthScope): Promise<UserExistsResponse> => {
    const params = new URLSearchParams({ email, scope: scope.toUpperCase() });
    const response = await httpClient.get<ApiResponse<UserExistsResponse>>(
      `/v1/users/by-email-and-scope/exists?${params.toString()}`,
      { skipAuth: true }
    );
    return response?.data ?? (response as unknown as UserExistsResponse);
  },
};
