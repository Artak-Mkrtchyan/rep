import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import { useAuth } from '@/context/AuthContext';
import { AuthScope } from '@/lib/api/auth';
import { OAuthProvider, oauthService } from '@/lib/api/oauth.service';

export const useGoogleOAuth = () => {
  const { setTokens } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGoogleAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // AC7: Google sign-in is only supported for individual users, so we
      // always request the USUAL scope regardless of where the button is
      // invoked from. This locks the account type pre-redirect.
      const startUrl = oauthService.getOAuthStartUrl(OAuthProvider.GOOGLE, AuthScope.USUAL);

      // The auth/complete web page will detect mobile context and redirect
      // to rep://auth/callback with tokens. openAuthSessionAsync catches this.
      const returnUrl = Linking.createURL('auth/callback');

      const result = await WebBrowser.openAuthSessionAsync(startUrl, returnUrl);

      if (result.type !== 'success' || !('url' in result)) {
        return;
      }

      // Parse the deep link URL for tokens
      const url = result.url;

      const parsed = Linking.parse(url);
      const accessToken = parsed.queryParams?.accessToken as string | undefined;
      const refreshToken = parsed.queryParams?.refreshToken as string | undefined;
      const refreshTokenExpiresAt = parsed.queryParams?.refreshTokenExpiresAt as
        | string
        | undefined;

      if (accessToken && refreshToken) {
        await setTokens({ accessToken, refreshToken, refreshTokenExpiresAt });
      } else {
        throw new Error('No tokens received from OAuth callback');
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'An error occurred during Google sign-in';
      setError(errorMsg);
      Alert.alert('Google Sign-In Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [setTokens]);

  return { startGoogleAuth, isLoading, error };
};
