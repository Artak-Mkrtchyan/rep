import { Alert } from 'react-native';

import { ApiError } from '@/lib/api/auth.types';
import i18n from '@/lib/i18n/i18n';

export const ERROR_MESSAGES = {
  get UNEXPECTED() { return i18n.t('error.unexpected'); },
  get NETWORK() { return i18n.t('error.network'); },
  get SERVER() { return i18n.t('error.server'); },
  get UPLOAD_FAILED() { return i18n.t('error.upload_failed'); },
  get UPLOAD_UNEXPECTED() { return i18n.t('error.upload_unexpected'); },
  get RESEND_CODE_FAILED() { return i18n.t('error.resend_code_failed'); },
  get SUBMIT_FAILED() { return i18n.t('error.submit_failed'); },
  get RESET_PASSWORD_FAILED() { return i18n.t('error.reset_password_failed'); },
  get CHANGE_PASSWORD_FAILED() { return i18n.t('error.change_password_failed'); },
  get SEND_RESET_CODE_FAILED() { return i18n.t('error.send_reset_code_failed'); },
  get INVALID_CODE() { return i18n.t('error.invalid_code'); },
  get SERVICE_UNAVAILABLE() { return i18n.t('error.service_unavailable'); },
};

export function isApiError(error: unknown): error is ApiError {
  return error !== null && typeof error === 'object' && 'statusCode' in error;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string = ERROR_MESSAGES.UNEXPECTED
): string {
  if (isApiError(error)) {
    return error.message || fallback;
  }
  return fallback;
}

export function showErrorAlert(
  error: unknown,
  options?: { title?: string; fallback?: string; statusMessages?: Record<number, string> }
) {
  const { title = i18n.t('error.title'), fallback = ERROR_MESSAGES.UNEXPECTED, statusMessages } = options ?? {};

  console.log('error', error);
  console.log('statusMessages', statusMessages);
  console.log('fallback', fallback);
  console.log('title', title);
  if (statusMessages && isApiError(error) && error.statusCode !== undefined) {
    const statusMessage = statusMessages[error.statusCode];
    if (statusMessage) {
      Alert.alert(title, statusMessage);
      return;
    }
  }

  Alert.alert(title, getApiErrorMessage(error, fallback));
}
