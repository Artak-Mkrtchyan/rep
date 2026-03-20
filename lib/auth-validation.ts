import * as Yup from 'yup';

import i18n from '@/lib/i18n/i18n';
import type { PasswordRequirements } from '@/types/auth';

export const PASSWORD_MIN_LENGTH = 8;
export const OTP_LENGTH = 6;
export const RESEND_CODE_TIMEOUT = 60;
export const OTP_EXPIRATION_TIMEOUT = 300; // 5 minutes
export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 100;
export const FULL_NAME_REGEX = /^[a-zA-ZА-Яа-яЁёЎўҚқҒғҲҳ'\u2018\u2019\-\s]+$/;
export const EMAIL_REGEX =
  /^(?=^.{1,64}@)(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
export const EMAIL_LOCAL_MAX_LENGTH = 64;
export const PHONE_REGEX = /^\+998\d{9}$/;
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const yupSchemas = {
  email: Yup.string()
    .required(() => i18n.t('validation.email_required'))
    .test('email-format', (val, ctx) => {
      if (!val) return true;
      const trimmed = val.trim();

      if (!trimmed.includes('@')) {
        return ctx.createError({ message: i18n.t('validation.email_format') });
      }

      const [local] = trimmed.split('@');

      if (local.length > EMAIL_LOCAL_MAX_LENGTH) {
        return ctx.createError({
          message: i18n.t('validation.email_local_part_too_long'),
        });
      }

      if (local.startsWith('.')) {
        return ctx.createError({ message: i18n.t('validation.email_starts_with_dot') });
      }

      if (local.includes('..')) {
        return ctx.createError({ message: i18n.t('validation.email_consecutive_dots') });
      }

      if (!EMAIL_REGEX.test(trimmed)) {
        return ctx.createError({
          message: i18n.t('validation.email_invalid'),
        });
      }

      return true;
    }),
  fullName: Yup.string()
    .required(() => i18n.t('validation.full_name_required'))
    .min(FULL_NAME_MIN_LENGTH, () => i18n.t('validation.full_name_min_length'))
    .max(FULL_NAME_MAX_LENGTH, () => i18n.t('validation.full_name_max_length'))
    .test(
      'no-leading-trailing-spaces',
      () => i18n.t('validation.no_leading_trailing_spaces'),
      (val) => (val ? val === val.trim() : true)
    )
    .test('valid-characters', (val, ctx) => {
      if (!val) return true;
      if (!FULL_NAME_REGEX.test(val)) {
        const hasNumbers = /\d/.test(val);
        const hasInvalidSymbols = /[^a-zA-ZА-Яа-яЁёЎўҚқҒғҲҳ'\u2018\u2019\-\s]/.test(val);

        if (hasNumbers || hasInvalidSymbols) {
          return ctx.createError({
            message: i18n.t('validation.full_name_invalid_chars'),
          });
        }

        return ctx.createError({
          message: i18n.t('validation.full_name_allowed_alphabets'),
        });
      }
      return true;
    })
    .test(
      'has-two-words',
      () => i18n.t('validation.full_name_two_words'),
      (val) => (val ? val.trim().split(/\s+/).length >= 2 : true)
    ),
  phone: Yup.string()
    .required(() => i18n.t('validation.required'))
    .matches(PHONE_REGEX, () => i18n.t('validation.invalid_phone_number')),
  phoneOptional: Yup.string()
    .matches(PHONE_REGEX, () => i18n.t('validation.invalid_phone_number'))
    .optional(),
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, () => i18n.t('validation.password_too_short'))
    .matches(/[A-Z]/, () => i18n.t('validation.must_contain_uppercase'))
    .matches(/[a-z]/, () => i18n.t('validation.must_contain_lowercase'))
    .matches(/\d/, () => i18n.t('validation.must_contain_number'))
    .matches(/[^A-Za-z0-9]/, () => i18n.t('validation.must_contain_symbol'))
    .required(() => i18n.t('validation.required')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], () => i18n.t('validation.passwords_do_not_match'))
    .required(() => i18n.t('validation.required')),
  certifiedOn: Yup.string()
    .required(() => i18n.t('validation.required'))
    .matches(DATE_REGEX, () => i18n.t('validation.date_incorrect_format')),
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
