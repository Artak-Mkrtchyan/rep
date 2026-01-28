import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REFRESH_TOKEN_EXPIRES_KEY = 'refresh_token_expires_at';

// In-memory cache for synchronous access
let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let cachedRefreshTokenExpiresAt: string | null = null;
let isInitialized = false;

// Initialize tokens from SecureStore (call this on app start)
export const initializeTokenStorage = async (): Promise<void> => {
  if (isInitialized) return;

  try {
    const [accessToken, refreshToken, expiresAt] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_EXPIRES_KEY),
    ]);

    cachedAccessToken = accessToken;
    cachedRefreshToken = refreshToken;
    cachedRefreshTokenExpiresAt = expiresAt;
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize token storage:', error);
    isInitialized = true;
  }
};

// Access Token
export const getToken = (): string | null => {
  return cachedAccessToken;
};

export const setToken = (token: string): void => {
  cachedAccessToken = token;
  SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token).catch((error) => {
    console.error('Failed to save access token:', error);
  });
};

export const removeToken = (): void => {
  cachedAccessToken = null;
  SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY).catch((error) => {
    console.error('Failed to remove access token:', error);
  });
};

export const hasToken = (): boolean => {
  return cachedAccessToken !== null;
};

// Refresh Token
export const getRefreshToken = (): string | null => {
  return cachedRefreshToken;
};

export const setRefreshToken = (token: string, expiresAt: string): void => {
  cachedRefreshToken = token;
  cachedRefreshTokenExpiresAt = expiresAt;

  Promise.all([
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
    SecureStore.setItemAsync(REFRESH_TOKEN_EXPIRES_KEY, expiresAt),
  ]).catch((error) => {
    console.error('Failed to save refresh token:', error);
  });
};

export const removeRefreshToken = (): void => {
  cachedRefreshToken = null;
  cachedRefreshTokenExpiresAt = null;

  Promise.all([
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_EXPIRES_KEY),
  ]).catch((error) => {
    console.error('Failed to remove refresh token:', error);
  });
};

export const isRefreshTokenValid = (): boolean => {
  if (!cachedRefreshToken || !cachedRefreshTokenExpiresAt) {
    return false;
  }

  const expiryDate = new Date(cachedRefreshTokenExpiresAt);
  const now = new Date();

  // Token is valid if expiry date is in the future (with 30 second buffer)
  return expiryDate.getTime() > now.getTime() + 30000;
};

// Clear all auth tokens
export const clearAllTokens = (): void => {
  removeRefreshToken();
  removeToken();
};

// Update cache from external source (e.g., AuthContext)
export const updateTokenCache = (accessToken: string | null, refreshToken: string | null): void => {
  cachedAccessToken = accessToken;
  cachedRefreshToken = refreshToken;
};
