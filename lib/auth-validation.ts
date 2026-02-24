import * as Yup from 'yup';

import type { PasswordRequirements } from '@/types/auth';

export const PASSWORD_MIN_LENGTH = 8;
export const OTP_LENGTH = 6;
export const RESEND_CODE_TIMEOUT = 60;
export const OTP_EXPIRATION_TIMEOUT = 300; // 5 minutes
export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 100;
export const FULL_NAME_REGEX = /^[a-zA-ZА-Яа-яЁёЎўҚқҒғҲҳ'-\s]+$/;
export const EMAIL_REGEX =
  /^(?=^.{1,64}@)(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
export const EMAIL_LOCAL_MAX_LENGTH = 64;
export const PHONE_REGEX = /^\+998\d{9}$/;
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const yupSchemas = {
  email: Yup.string()
    .required('Email is required')
    .test('email-format', (val, ctx) => {
      if (!val) return true;
      const trimmed = val.trim();

      if (!trimmed.includes('@')) {
        return ctx.createError({ message: 'Email must follow the format: local@domain' });
      }

      const [local] = trimmed.split('@');

      if (local.length > EMAIL_LOCAL_MAX_LENGTH) {
        return ctx.createError({
          message: `The part before '@' must be no more than ${EMAIL_LOCAL_MAX_LENGTH} characters`,
        });
      }

      if (local.startsWith('.')) {
        return ctx.createError({ message: 'Email must not start with a dot' });
      }

      if (local.includes('..')) {
        return ctx.createError({ message: 'Email must not contain consecutive dots' });
      }

      if (!EMAIL_REGEX.test(trimmed)) {
        return ctx.createError({ message: 'Please enter a valid email address (e.g. name@example.com)' });
      }

      return true;
    }),
  fullName: Yup.string()
    .required('Full name is required')
    .min(FULL_NAME_MIN_LENGTH, `Must be at least ${FULL_NAME_MIN_LENGTH} characters`)
    .max(FULL_NAME_MAX_LENGTH, `Must be no more than ${FULL_NAME_MAX_LENGTH} characters`)
    .test('no-leading-trailing-spaces', 'Must not start or end with a space', (val) =>
      val ? val === val.trim() : true
    )
    .test('valid-characters', (val, ctx) => {
      if (!val) return true;
      if (!FULL_NAME_REGEX.test(val)) {
        const hasNumbers = /\d/.test(val);
        const hasInvalidSymbols = /[^a-zA-ZА-Яа-яЁёЎўҚқҒғҲҳ'\-\s]/.test(val);

        if (hasNumbers || hasInvalidSymbols) {
          return ctx.createError({
            message: 'Full name may contain only letters, hyphens, and apostrophes',
          });
        }

        return ctx.createError({
          message:
            'Only Latin (A–Z), Cyrillic Russian (А–Я), and Uzbek (Ўў, Ққ, Ғғ, Ҳҳ) letters are allowed',
        });
      }
      return true;
    })
    .test('has-two-words', 'Please enter both first and last name', (val) =>
      val ? val.trim().split(/\s+/).length >= 2 : true
    ),
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
  certifiedOn: Yup.string().required('Required').matches(DATE_REGEX, 'Date in incorrect format'),
};

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
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
