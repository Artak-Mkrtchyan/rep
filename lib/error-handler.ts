import { Alert } from 'react-native';

import { ApiError } from '@/lib/api/auth.types';

export const ERROR_MESSAGES = {
  UNEXPECTED: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error: Unable to reach the server. Please check your internet connection and try again.',
  SERVER: 'Server error occurred. Please try again later.',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  UPLOAD_UNEXPECTED: 'An unexpected error occurred while uploading the file.',
  RESEND_CODE_FAILED: 'Failed to resend code. Please try again.',
  SUBMIT_FAILED: 'Failed to submit. Please try again.',
  RESET_PASSWORD_FAILED: 'Failed to reset password. Please try again.',
  CHANGE_PASSWORD_FAILED: 'Failed to change password. Please try again.',
  SEND_RESET_CODE_FAILED: 'Failed to send reset code. Please try again.',
  INVALID_CODE: 'Invalid or expired verification code. Please try again.',
  SERVICE_UNAVAILABLE: 'The password reset service is currently unavailable. Please try again later.',
} as const;

export function isApiError(error: unknown): error is ApiError {
  return error !== null && typeof error === 'object' && 'statusCode' in error;
}

export function getApiErrorMessage(error: unknown, fallback: string = ERROR_MESSAGES.UNEXPECTED): string {
  if (isApiError(error)) {
    return error.message || fallback;
  }
  return fallback;
}

export function showErrorAlert(
  error: unknown,
  options?: { title?: string; fallback?: string; statusMessages?: Record<number, string> }
) {
  const { title = 'Error', fallback = ERROR_MESSAGES.UNEXPECTED, statusMessages } = options ?? {};

  if (statusMessages && isApiError(error) && error.statusCode !== undefined) {
    const statusMessage = statusMessages[error.statusCode];
    if (statusMessage) {
      Alert.alert(title, statusMessage);
      return;
    }
  }

  Alert.alert(title, getApiErrorMessage(error, fallback));
}
