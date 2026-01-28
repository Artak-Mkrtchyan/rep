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
 */
export const getApiUrl = (): string =>
  isProduction() ? 'https://rep.utspdev.com/api' : 'https://rep-dev.utspdev.com/api';
