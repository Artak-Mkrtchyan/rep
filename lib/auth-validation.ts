import * as Yup from 'yup';

import type { PasswordRequirements } from '@/types/auth';

export const PASSWORD_MIN_LENGTH = 8;
export const OTP_LENGTH = 6;
export const RESEND_CODE_TIMEOUT = 60;
export const OTP_EXPIRATION_TIMEOUT = 300; // 5 minutes
export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 100;
export const FULL_NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ'-]+(?: [a-zA-ZÀ-ÖØ-öø-ÿ'-]+)+$/;
export const PHONE_REGEX = /^\+998\d{9}$/;
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const yupSchemas = {
  email: Yup.string().email('Invalid email').required('Required'),
  fullName: Yup.string()
    .required('Required')
    .min(FULL_NAME_MIN_LENGTH, 'Name is too short')
    .max(FULL_NAME_MAX_LENGTH, 'Name is too long')
    .matches(FULL_NAME_REGEX, 'Enter a valid full name (first and last name)'),
  phone: Yup.string().required('Required').matches(PHONE_REGEX, 'Invalid phone number'),
  phoneOptional: Yup.string().matches(PHONE_REGEX, 'Invalid phone number').optional(),
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, 'Password too short')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[a-z]/, 'Must contain lowercase')
    .matches(/\d/, 'Must contain number')
    .matches(/[^A-Za-z0-9]/, 'Must contain symbol')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Required'),
  certifiedOn: Yup.string()
    .required('Required')
    .matches(DATE_REGEX, 'Date in incorrect format'),
};

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
