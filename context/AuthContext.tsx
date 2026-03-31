import { AuthScope, authService } from '@/lib/api/auth';
import {
  clearAllTokens as clearHttpClientTokens,
  initializeTokenStorage,
  updateTokenCache,
} from '@/lib/api/http/token-storage';
import * as SecureStore from 'expo-secure-store';
import React from 'react';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserInfo = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  scope: AuthScope;
};

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  user: { accessToken: string; refreshToken: string } | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  isLoading: boolean;
  setTokens: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  getAuthHeader: () => Record<string, string>;
};

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const [isRestoring, setIsRestoring] = React.useState(true);

  const fetchUserInfo = React.useCallback(async () => {
    try {
      const actor = await authService.getCurrentActor();
      setUserInfo({
        id: actor.id,
        email: actor.email,
        fullName: actor.fullName,
        phone: actor.phone || '',
        role: actor.roles[0]?.name || 'user',
        scope: actor.scope,
      });
    } catch {
      // Non-critical — userInfo will be null
      setUserInfo(null);
    }
  }, []);

  // Sync tokens with HTTP client cache whenever they change
  React.useEffect(() => {
    updateTokenCache(accessToken, refreshToken);
  }, [accessToken, refreshToken]);

  React.useEffect(() => {
    let isMounted = true;

    const restoreAndValidateSession = async () => {
      try {
        // Initialize HTTP client token storage
        await initializeTokenStorage();

        // Step 1: Restore tokens from secure storage
        const [, storedRefresh] = await Promise.all([
          SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
          SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
        ]);

        if (!isMounted) return;

        // Step 2: If we have a refresh token, validate it by refreshing
        if (storedRefresh) {
          try {
            const response = await authService.refreshToken(storedRefresh);

            if (!isMounted) return;

            // Refresh succeeded - update tokens
            if (response.accessToken && response.refreshToken) {
              setAccessToken(response.accessToken);
              setRefreshToken(response.refreshToken);
              await Promise.all([
                SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken),
                SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken),
              ]);

              // Fetch user info from API (like web does)
              await fetchUserInfo();
            } else {
              // Invalid response - clear tokens
              await clearStoredTokens();
            }
          } catch {
            // Refresh failed - token is invalid, clear everything
            if (!isMounted) return;
            await clearStoredTokens();
          }
        } else {
          // No refresh token stored - user is not authenticated
          setAccessToken(null);
          setRefreshToken(null);
        }
      } catch {
        // Restore errors - user will be unauthenticated
        if (isMounted) {
          setAccessToken(null);
          setRefreshToken(null);
        }
      } finally {
        if (isMounted) setIsRestoring(false);
      }
    };

    const clearStoredTokens = async () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUserInfo(null);
      clearHttpClientTokens();
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);
    };

    restoreAndValidateSession();

    return () => {
      isMounted = false;
    };
  }, [fetchUserInfo]);

  const setTokens = React.useCallback(
    async (tokens: AuthTokens) => {
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
      ]);

      // Fetch user info after login (like web does)
      await fetchUserInfo();
    },
    [fetchUserInfo]
  );

  const logout = React.useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserInfo(null);
    clearHttpClientTokens();
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  }, []);

  const getAuthHeader = React.useCallback(() => {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
  }, [accessToken]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      accessToken,
      refreshToken,
      user: accessToken && refreshToken ? { accessToken, refreshToken } : null,
      userInfo,
      isAuthenticated: Boolean(accessToken),
      isRestoring,
      isLoading: isRestoring,
      setTokens,
      logout,
      getAuthHeader,
    }),
    [accessToken, refreshToken, userInfo, isRestoring, setTokens, logout, getAuthHeader]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
