import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import { useAuth } from '@/context/AuthContext';
import { AuthScope } from '@/lib/api/auth';
import { OAuthProvider, oauthService } from '@/lib/api/oauth.service';

interface UseGoogleOAuthOptions {
  scope?: AuthScope;
}

export const useGoogleOAuth = (options: UseGoogleOAuthOptions = {}) => {
  const { scope = AuthScope.USUAL } = options;
  const { setTokens } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGoogleAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build the backend start URL — browser handles all redirects:
      // backend → Google → backend callback → auth/complete page
      const startUrl = oauthService.getOAuthStartUrl(OAuthProvider.GOOGLE, scope);
      console.log('[GoogleOAuth] Opening browser with start URL:', startUrl);

      // The auth/complete web page will detect mobile context and redirect
      // to rep://auth/callback with tokens. openAuthSessionAsync catches this.
      const returnUrl = Linking.createURL('auth/callback');
      console.log('[GoogleOAuth] Return URL (deep link):', returnUrl);

      const result = await WebBrowser.openAuthSessionAsync(startUrl, returnUrl, {
        preferEphemeralSession: true,
      });
      console.log('[GoogleOAuth] Browser result:', result.type);

      if (result.type !== 'success' || !('url' in result)) {
        console.log('[GoogleOAuth] Flow cancelled or dismissed');
        return;
      }

      // Parse the deep link URL for tokens
      const url = result.url;
      console.log('[GoogleOAuth] Returned URL:', url);

      const parsed = Linking.parse(url);
      const accessToken = parsed.queryParams?.accessToken as string | undefined;
      const refreshToken = parsed.queryParams?.refreshToken as string | undefined;

      if (accessToken && refreshToken) {
        await setTokens({ accessToken, refreshToken });
        console.log('[GoogleOAuth] Login complete!');
      } else {
        throw new Error('No tokens received from OAuth callback');
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'An error occurred during Google sign-in';
      console.error('[GoogleOAuth] Error:', errorMsg);
      setError(errorMsg);
      Alert.alert('Google Sign-In Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [scope, setTokens]);

  return { startGoogleAuth, isLoading, error };
};
