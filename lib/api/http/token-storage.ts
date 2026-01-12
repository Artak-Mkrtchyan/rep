const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REFRESH_TOKEN_EXPIRES_KEY = 'refresh_token_expires_at';

// Custom event name for same-tab token changes
export const AUTH_TOKEN_CHANGE_EVENT = 'auth-token-change';

const dispatchTokenChangeEvent = (): void => {
    if (globalThis.window === undefined) {
        return;
    }
    globalThis.dispatchEvent(new CustomEvent(AUTH_TOKEN_CHANGE_EVENT));
};

// Access Token
export const getToken = (): string | null => {
    if (globalThis.window === undefined) {
        return null;
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setToken = (token: string): void => {
    if (globalThis.window === undefined) {
        return;
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    dispatchTokenChangeEvent();
};

export const removeToken = (): void => {
    if (globalThis.window === undefined) {
        return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    dispatchTokenChangeEvent();
};

export const hasToken = (): boolean => {
    if (globalThis.window === undefined) {
        return false;
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
};

// Refresh Token
export const getRefreshToken = (): string | null => {
    if (globalThis.window === undefined) {
        return null;
    }
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string, expiresAt: string): void => {
    if (globalThis.window === undefined) {
        return;
    }
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_EXPIRES_KEY, expiresAt);
};

export const removeRefreshToken = (): void => {
    if (globalThis.window === undefined) {
        return;
    }
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_KEY);
};

export const isRefreshTokenValid = (): boolean => {
    if (globalThis.window === undefined) {
        return false;
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const expiresAt = localStorage.getItem(REFRESH_TOKEN_EXPIRES_KEY);

    if (!refreshToken || !expiresAt) {
        return false;
    }

    const expiryDate = new Date(expiresAt);
    const now = new Date();

    // Token is valid if expiry date is in the future (with 30 second buffer)
    return expiryDate.getTime() > now.getTime() + 30000;
};

// Clear all auth tokens
export const clearAllTokens = (): void => {
    removeRefreshToken();
    removeToken(); // This dispatches the event
};
