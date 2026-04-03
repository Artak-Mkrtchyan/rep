/**
 * Environment configuration
 * Determines the current environment and provides API URL
 */

export type Environment = 'development' | 'production';

/**
 * Determines if the app is running in production mode
 */
export const isProduction = (): boolean => {
  return (
    process.env.NODE_ENV === 'production' || (typeof __DEV__ !== 'undefined' && __DEV__ === false)
  );
};

/**
 * Gets the current environment
 */
export const getEnvironment = (): Environment => {
  return isProduction() ? 'production' : 'development';
};

/**
 * Gets the API URL based on the current environment
 * Note: Using dev API for both environments until production API is ready
 */
export const getApiUrl = (): string => 'https://rep-test.utspdev.com/api';

/**
 * Universal link base for the mobile app.
 * On mobile: OS intercepts the URL and opens the app if installed,
 * otherwise the web fallback page redirects to the app store.
 * On desktop: the fallback page redirects to the corresponding web page.
 */
export const getMobileAppLink = (): string => {
  const env = getEnvironment();
  switch (env) {
    case 'production':
      return 'https://rep.utspdev.com/app/open';
    default:
      return 'https://rep-test.utspdev.com/app/open';
  }
};

export const MOBILE_APP_LINK = getMobileAppLink();

// TODO: Restore when production API is ready:
// export const getApiUrl = (): string =>
//   isProduction() ? 'https://rep.utspdev.com/api' : 'https://rep-dev.utspdev.com/api';
