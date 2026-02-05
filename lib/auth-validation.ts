import type { PasswordRequirements } from '@/types/auth';

export const PASSWORD_MIN_LENGTH = 8;
export const OTP_LENGTH = 6;
export const RESEND_CODE_TIMEOUT = 60;

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): PasswordRequirements => {
  return {
    hasMinLength: password.length >= PASSWORD_MIN_LENGTH,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };
};

export const isPasswordValid = (requirements: PasswordRequirements): boolean => {
  return (
    requirements.hasMinLength &&
    requirements.hasUpperCase &&
    requirements.hasLowerCase &&
    requirements.hasNumber &&
    requirements.hasSymbol
  );
};

export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password.length > 0 && password === confirmPassword;
};
