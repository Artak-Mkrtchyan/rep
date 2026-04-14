import { useAuth } from '@/context/AuthContext';
import { AuthScope, LoginResponse, authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/auth.types';
import { useCallback, useState } from 'react';

export interface UseLoginResult {
  login: (email: string, password: string, scope: AuthScope) => Promise<void>;
  isLoading: boolean;
  error: ApiError | null;
  reset: () => void;
}

export function useLogin(): UseLoginResult {
  const { setTokens } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const login = useCallback(
    async (email: string, password: string, scope: AuthScope = AuthScope.USUAL) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: LoginResponse = await authService.login(email, password, scope);

        if (response.accessToken && response.refreshToken) {
          await setTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            refreshTokenExpiresAt: response.refreshTokenExpiresAt,
          });
        }
      } catch (err) {
        const apiError: ApiError = {
          message: err instanceof Error ? err.message : 'Login failed. Please try again.',
          statusCode: (err as { statusCode?: number })?.statusCode,
        };
        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [setTokens]
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    login,
    isLoading,
    error,
    reset,
  };
}

export interface UseLogoutResult {
  logout: () => Promise<void>;
  isLoading: boolean;
}

export function useLogout(): UseLogoutResult {
  const { logout: clearAuth, refreshToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err) {
      // Even if server logout fails, clear local tokens
      console.error('Logout error:', err);
    } finally {
      await clearAuth();
      setIsLoading(false);
    }
  }, [clearAuth, refreshToken]);

  return {
    logout,
    isLoading,
  };
}
