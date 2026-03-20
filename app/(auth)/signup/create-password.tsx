import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { AuthLayout } from '@/components/auth/auth-layout';
import { PasswordRequirementsList } from '@/components/auth/password-requirements';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES } from '@/constants/auth';
import { useTheme } from '@/hooks/use-theme';
import { validatePassword, yupSchemas } from '@/lib/auth-validation';

import { PhoneInput } from '@/components/ui/phone-input';
import { useSignUpContext } from '@/context/SignUpContext';
import { authService } from '@/lib/api/auth';
import { isApiError, showErrorAlert } from '@/lib/error-handler';
import type { PasswordForm } from '@/types/auth';

const PasswordSchema = Yup.object().shape({
  email: yupSchemas.email,
  fullName: yupSchemas.fullName,
  phone: yupSchemas.phone,
  password: yupSchemas.password,
  confirmPassword: yupSchemas.confirmPassword,
});

export default function CreatePasswordScreen() {
  const { t } = useTranslation();
  const { tokens: theme } = useTheme();
  const { data, resetData } = useSignUpContext();

  const handleContinue = async (values: PasswordForm, { setSubmitting, setFieldError }: any) => {
    try {
      await authService.createUsualUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: values.phone,
      });

      resetData();

      router.push(AUTH_ROUTES.SIGNUP_COMPLETED);
    } catch (error) {
      if (isApiError(error)) {
        if (error.errors) {
          (Object.entries(error.errors) as [string, string[]][]).forEach(([field, messages]) => {
            if (messages?.[0]) {
              setFieldError(field, messages[0]);
            }
          });
        } else if (error.validationErrors?.length) {
          error.validationErrors.forEach(({ fieldName, errorMessage }) => {
            setFieldError(fieldName, errorMessage);
          });
        } else {
          showErrorAlert(error);
        }
      } else {
        showErrorAlert(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace(AUTH_ROUTES.LOGIN);
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google authentication
  };

  const handleAppleAuth = () => {
    // TODO: Implement Apple authentication
  };

  return (
    <AuthLayout scrollable>
      <Formik
        initialValues={{
          email: data.email || '',
          password: '',
          confirmPassword: '',
          fullName: '',
          phone: '',
        }}
        validationSchema={PasswordSchema}
        onSubmit={handleContinue}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => {
          const passwordRequirements = validatePassword(values.password);

          return (
            <>
              <ThemedText type="title" className="mt-10 text-center">
                {t('signup.title')}
              </ThemedText>

              <Input
                label={t('auth.email')}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email ? errors.email : undefined}
                placeholder=""
                disabled
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={theme.placeholder}
              />

              <Input
                label={t('auth.full_name')}
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName ? errors.fullName : undefined}
                placeholder=""
              />

              <PhoneInput
                label={t('auth.phone_number')}
                value={values.phone}
                onChangeText={(text) => handleChange('phone')(text)}
                onBlur={handleBlur('phone')}
                error={touched.phone && errors.phone ? errors.phone : undefined}
              />

              <Input
                label={t('auth.password')}
                value={values.password}
                showPasswordToggle
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password && errors.password ? errors.password : undefined}
                secureTextEntry
                placeholder=""
                placeholderTextColor={theme.placeholder}
              />

              <PasswordRequirementsList
                hasMinLength={passwordRequirements.hasMinLength}
                hasUpperCase={passwordRequirements.hasUpperCase}
                hasLowerCase={passwordRequirements.hasLowerCase}
                hasNumber={passwordRequirements.hasNumber}
                hasSymbol={passwordRequirements.hasSymbol}
                hasOnlyAllowedChars={passwordRequirements.hasOnlyAllowedChars}
              />

              <Input
                label={t('auth.confirm_password')}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                isInvalid={!!(touched.confirmPassword && errors.confirmPassword)}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : undefined
                }
                secureTextEntry
                showPasswordToggle
                placeholder=""
                placeholderTextColor={theme.placeholder}
              />

              <Button
                disabled={Object.keys(errors).length !== 0 || isSubmitting}
                onPress={() => handleSubmit()}
                accessibilityLabel={t('common.continue')}>
                {t('common.continue')}
              </Button>

              <SignInFooter
                onGooglePress={handleGoogleAuth}
                onApplePress={handleAppleAuth}
                onSignInPress={handleGoToLogin}
                showSignInLink
              />
            </>
          );
        }}
      </Formik>
    </AuthLayout>
  );
}
