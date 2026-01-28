import { ApiResponse } from './auth.types';
import { httpClient } from './http/client';

export interface ConfirmEmailRequest {
  code: string;
}

export interface RequestEmailConfirmationRequest {
  email: string;
}

export enum AuthScope {
  SYSTEM = 'SYSTEM',
  ADMIN = 'ADMIN',
  BROKER = 'BROKER',
  BROKER_COMPANY = 'BROKER_COMPANY',
  CONSTRUCTION = 'CONSTRUCTION',
  USUAL = 'USUAL',
}

export interface LoginRequest {
  login: string;
  password: string;
  scope: AuthScope;
}

export interface LoginResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  accessTokenIssuedAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  refreshTokenIssuedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

export interface RegisterResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  accessTokenIssuedAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  refreshTokenIssuedAt: string;
}

export interface CreateUsualUserRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface CreateUsualUserResponse {
  id?: string;
  email?: string;
  fullName?: string;
  message?: string;
}

export interface ForgotPasswordRequest {
  email: string;
  scope: AuthScope;
}

export interface ResetPasswordRequest {
  email: string;
  scope: AuthScope;
  newPassword: string;
  otp: string;
}

export const authService = {
  requestEmailConfirmation: async (email: string): Promise<void> => {
    await httpClient.post<void>(
      '/v1/otp/email-confirmation/send',
      { email } as RequestEmailConfirmationRequest,
      {
        skipAuth: true,
      }
    );
  },

  confirmEmail: async (code: string): Promise<void> => {
    await httpClient.post<void>(
      '/v1/otp/email-confirmation/confirm',
      { code } as ConfirmEmailRequest,
      {
        skipAuth: true,
      }
    );
  },

  login: async (
    login: string,
    password: string,
    scope: AuthScope = AuthScope.USUAL
  ): Promise<LoginResponse> => {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      '/auth/users/access-and-refresh-tokens',
      { login, password, scope } as LoginRequest,
      { skipAuth: true }
    );
    return response.data || (response as unknown as LoginResponse);
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await httpClient.post<ApiResponse<RegisterResponse>>('/auth/register', data, {
      skipAuth: true,
    });
    return response.data || (response as unknown as RegisterResponse);
  },

  logout: async (refreshToken: string): Promise<void> => {
    await httpClient.delete<void>(
      '/auth/users/refresh-tokens/revoke',
      { refreshToken },
      {
        requiresAuth: true,
      }
    );
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await httpClient.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/users/access-and-refresh-tokens/refresh',
      { refreshToken } as RefreshTokenRequest,
      { skipAuth: true }
    );
    return response.data || (response as unknown as RefreshTokenResponse);
  },

  createUsualUser: async (data: CreateUsualUserRequest): Promise<CreateUsualUserResponse> => {
    const response = await httpClient.post<ApiResponse<CreateUsualUserResponse>>(
      '/v1/users/usual',
      data,
      { skipAuth: true }
    );
    return response.data || (response as unknown as CreateUsualUserResponse);
  },

  requestPasswordReset: async (
    email: string,
    scope: AuthScope = AuthScope.USUAL
  ): Promise<void> => {
    const response = await httpClient.post<ApiResponse<void>>(
      '/v1/otp/password-confirmation/send',
      { email, scope } as ForgotPasswordRequest,
      { skipAuth: true }
    );
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await httpClient.post<void>('/v1/users/change-password', data, { skipAuth: true });
  },
};
