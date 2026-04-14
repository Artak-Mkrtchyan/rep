import { getApiUrl } from '@/constants/env';
import i18n from '@/lib/i18n/i18n';
import { ApiError, ValidationError } from '../auth.types';
import {
  clearAllTokens,
  getRefreshToken,
  getToken,
  isRefreshTokenValid,
  setRefreshToken,
  setToken,
} from './token-storage';

export interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
  skipAuth?: boolean;
  _isRetry?: boolean;
  body?: string | FormData | undefined;
}

// Refresh token state management
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export const getLocale = (): string => {
  return i18n.language;
};

const subscribeToTokenRefresh = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken: string): void => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const onRefreshFailed = (): void => {
  refreshSubscribers = [];
};

class HttpClient {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = getApiUrl();
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = getRefreshToken();

    if (!refreshToken || !isRefreshTokenValid()) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/users/access-and-refresh-tokens/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const tokenData = data.data || data;

      // Update stored tokens
      setToken(tokenData.accessToken);
      setRefreshToken(tokenData.refreshToken, tokenData.refreshTokenExpiresAt);

      return tokenData.accessToken;
    } catch {
      return null;
    }
  }

  private async handleUnauthorized<T>(endpoint: string, config: RequestConfig): Promise<T | null> {
    // Skip refresh for auth-related endpoints or retry requests
    if (config.skipAuth || config._isRetry) {
      return null;
    }

    // Check if refresh token is valid
    if (!isRefreshTokenValid()) {
      clearAllTokens();
      return null;
    }

    // If already refreshing, wait for the refresh to complete
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        subscribeToTokenRefresh(async (newToken: string) => {
          try {
            const retryConfig: RequestConfig = {
              ...config,
              _isRetry: true,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${newToken}`,
              },
            };
            const result = await this.request<T>(endpoint, retryConfig);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    // Start refreshing
    isRefreshing = true;

    try {
      const newToken = await this.refreshAccessToken();

      if (newToken) {
        onTokenRefreshed(newToken);

        // Retry the original request with new token
        const retryConfig: RequestConfig = {
          ...config,
          _isRetry: true,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          },
        };
        return await this.request<T>(endpoint, retryConfig);
      }

      // Refresh failed, clear tokens
      clearAllTokens();
      onRefreshFailed();
      return null;
    } finally {
      isRefreshing = false;
    }
  }

  private async handleResponse<T>(
    response: Response,
    endpoint: string,
    config: RequestConfig
  ): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      // Handle 401 Unauthorized - attempt token refresh
      if (response.status === 401 && !config._isRetry) {
        const retryResult = await this.handleUnauthorized<T>(endpoint, config);
        if (retryResult !== null) {
          return retryResult;
        }
        // If refresh failed, continue to throw the error
      }

      let errorMessage = `HTTP error! status: ${response.status}`;
      let errors: Record<string, string[]> | undefined;
      let validationErrors: ValidationError[] | undefined;

      if (isJson) {
        try {
          const errorData = await response.json();
          const rawMessage = errorData.message || errorData.errorMessage || errorData.error;
          if (Array.isArray(rawMessage)) {
            errorMessage = rawMessage[0] || errorMessage;
          } else if (rawMessage) {
            errorMessage = rawMessage;
          }
          errors = errorData.errors;

          if (!errors && errorData.validationErrors?.length) {
            errorMessage = errorData.validationErrors[0].errorMessage;
            validationErrors = errorData.validationErrors;
          }
        } catch {
          // If JSON parsing fails, use default error message
        }
      } else {
        try {
          const text = await response.text();
          // Some services return JSON with a non-JSON content-type; try parsing it
          if (text && (text.startsWith('{') || text.startsWith('['))) {
            try {
              const errorData = JSON.parse(text);
              const rawMessage = errorData.message || errorData.errorMessage || errorData.error;
              if (Array.isArray(rawMessage)) {
                errorMessage = rawMessage[0] || errorMessage;
              } else if (rawMessage) {
                errorMessage = rawMessage;
              }
              errors = errorData.errors;
              if (!errors && errorData.validationErrors?.length) {
                errorMessage = errorData.validationErrors[0].errorMessage;
                validationErrors = errorData.validationErrors;
              }
            } catch {
              errorMessage = text || errorMessage;
            }
          } else {
            errorMessage = text || errorMessage;
          }
        } catch {
          // If text parsing fails, use default error message
        }
      }

      const apiError: ApiError = {
        message: errorMessage,
        statusCode: response.status,
        errors,
        validationErrors,
      };

      throw apiError;
    }

    // Handle void/empty responses
    if (response.status === 204 || (response.status === 201 && !isJson)) {
      return undefined as T;
    }

    if (isJson) {
      return await response.json();
    }

    return (await response.text()) as T;
  }

  private getHeaders(config: RequestConfig): HeadersInit {
    const headers: HeadersInit = {};

    const isFormData = config.body instanceof FormData;

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (isFormData && key.toLowerCase() === 'content-type') {
            return;
          }
          (headers as Record<string, string>)[key] = String(value);
        }
      });
    }

    // Add locale header
    headers['Locale'] = getLocale();

    // Add authorization header if auth is required and not explicitly skipped
    if (config.requiresAuth !== false && !config.skipAuth) {
      const token = getToken();
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(config);

    try {
      const response = await fetch(url, {
        ...config,
        headers,
      });

      return await this.handleResponse<T>(response, endpoint, config);
    } catch (error) {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error;
      }

      // Network or other errors
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        statusCode: 0,
      };
      throw apiError;
    }
  }

  async getFile(endpoint: string, config: RequestConfig = {}): Promise<Blob> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(config);

    const response = await fetch(url, {
      ...config,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    return await response.blob();
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const isFormData = data instanceof FormData;
    const body = data ? (isFormData ? data : JSON.stringify(data)) : undefined;

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body,
    });
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const httpClient = new HttpClient();
