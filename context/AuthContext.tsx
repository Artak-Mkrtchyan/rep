import * as SecureStore from 'expo-secure-store';
import React from 'react';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  user: { accessToken: string; refreshToken: string } | null;
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
  const [isRestoring, setIsRestoring] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [storedAccess, storedRefresh] = await Promise.all([
          SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
          SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
        ]);
        if (!isMounted) return;
        setAccessToken(storedAccess ?? null);
        setRefreshToken(storedRefresh ?? null);
      } catch {
        // Ignore restore errors; user will be unauthenticated
      } finally {
        if (isMounted) setIsRestoring(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const setTokens = React.useCallback(async (tokens: AuthTokens) => {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
    ]);
  }, []);

  const logout = React.useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
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
      isAuthenticated: Boolean(accessToken),
      isRestoring,
      isLoading: isRestoring,
      setTokens,
      logout,
      getAuthHeader,
    }),
    [accessToken, refreshToken, isRestoring, setTokens, logout, getAuthHeader]
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
