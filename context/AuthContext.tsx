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
  refreshTokenExpiresAt?: string;
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
  refreshUser: () => Promise<void>;
  updateUserInfo: (partial: Partial<UserInfo>) => void;
};

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const REFRESH_TOKEN_EXPIRES_AT_KEY = 'auth.refreshTokenExpiresAt';

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = React.useState<string | null>(null);
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
    updateTokenCache(accessToken, refreshToken, refreshTokenExpiresAt);
  }, [accessToken, refreshToken, refreshTokenExpiresAt]);

  React.useEffect(() => {
    let isMounted = true;

    const restoreAndValidateSession = async () => {
      try {
        // Initialize HTTP client token storage
        await initializeTokenStorage();

        // Restore tokens from secure storage
        const [storedAccess, storedRefresh, storedExpiresAt] = await Promise.all([
          SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
          SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
          SecureStore.getItemAsync(REFRESH_TOKEN_EXPIRES_AT_KEY),
        ]);

        if (!isMounted) return;

        // If we have stored tokens, trust them and let the http client
        // refresh lazily on 401 if needed. Don't proactively refresh —
        // the backend rejects refresh calls with a linked session.
        if (storedAccess && storedRefresh) {
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
          setRefreshTokenExpiresAt(storedExpiresAt);

          // Fetch user info — if the access token is expired, the http
          // client will auto-refresh and retry, then clearAllTokens on
          // unrecoverable failure.
          try {
            await fetchUserInfo();
          } catch {
            // Non-critical
          }
        } else {
          // No tokens stored - user is not authenticated
          setAccessToken(null);
          setRefreshToken(null);
          setRefreshTokenExpiresAt(null);
        }
      } catch {
        // Restore errors - user will be unauthenticated
        if (isMounted) {
          setAccessToken(null);
          setRefreshToken(null);
          setRefreshTokenExpiresAt(null);
        }
      } finally {
        if (isMounted) setIsRestoring(false);
      }
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
      setRefreshTokenExpiresAt(tokens.refreshTokenExpiresAt || null);
      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
        tokens.refreshTokenExpiresAt
          ? SecureStore.setItemAsync(REFRESH_TOKEN_EXPIRES_AT_KEY, tokens.refreshTokenExpiresAt)
          : SecureStore.deleteItemAsync(REFRESH_TOKEN_EXPIRES_AT_KEY),
      ]);

      // Fetch user info after login (like web does)
      await fetchUserInfo();
    },
    [fetchUserInfo]
  );

  const logout = React.useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setRefreshTokenExpiresAt(null);
    setUserInfo(null);
    clearHttpClientTokens();
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_EXPIRES_AT_KEY),
    ]);
  }, []);

  const updateUserInfo = React.useCallback((partial: Partial<UserInfo>) => {
    setUserInfo((prev) => (prev ? { ...prev, ...partial } : prev));
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
      refreshUser: fetchUserInfo,
      updateUserInfo,
    }),
    [accessToken, refreshToken, userInfo, isRestoring, setTokens, logout, getAuthHeader, fetchUserInfo, updateUserInfo]
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
