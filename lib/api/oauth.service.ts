import { getApiUrl } from '@/constants/env';
import { AuthScope } from './auth';

export enum OAuthProvider {
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

export enum DeviceType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

export const oauthService = {
  /**
   * Returns the full backend URL to start the OAuth authorization code flow.
   * Opens directly in the in-app browser — the browser handles all redirects
   * (backend → Google → backend callback → auth/complete page).
   */
  getOAuthStartUrl: (provider: OAuthProvider, scope: AuthScope = AuthScope.USUAL): string => {
    const baseUrl = getApiUrl();
    const params = new URLSearchParams({
      provider,
      scope,
      deviceType: DeviceType.MOBILE,
    });

    return `${baseUrl}/auth/oauth2/authorization-code-flow/start?${params.toString()}`;
  },
};
