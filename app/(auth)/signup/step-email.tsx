import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';
import { useSignUpFlow } from '@/hooks/use-signup-flow';
import { useTheme } from '@/hooks/use-theme';
import { authService, AuthScope } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/auth.types';
import { usersService } from '@/lib/api/users';
import { yupSchemas } from '@/lib/auth-validation';
import type { AccountRole } from '@/types/auth';
import { useRouter } from 'expo-router';

const roleToScope = (role?: AccountRole): AuthScope => {
  switch (role) {
    case 'broker':
    case 'broker_company':
      return AuthScope.BROKER;
    case 'company':
      return AuthScope.CONSTRUCTION;
    default:
      return AuthScope.USUAL;
  }
};

const EmailSchema = Yup.object().shape({
  email: yupSchemas.email,
});

export default function SignUpEmailStepScreen() {
  const { t } = useTranslation();
  const { tokens: theme } = useTheme();
  const { data, updateData } = useSignUpContext();
  const { goToNext } = useSignUpFlow();
  const router = useRouter();

  const handleContinue = async (
    values: { email: string },
    { setFieldError, setSubmitting }: any
  ) => {
    try {
      // Check if user with this email and role already exists
      const scope = roleToScope(data.role);
      const existsResponse = await usersService.checkUserExists(values.email, scope);

      if (existsResponse.exists) {
        setFieldError('email', t('signup.email_already_exists'));
        return;
      }

      await authService.requestEmailConfirmation(values.email);

      updateData({ email: values.email, otp: undefined });

      goToNext();
    } catch (error) {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const apiError = error as ApiError;

        if (apiError.errors?.email) {
          setFieldError('email', apiError.errors.email[0]);
        } else if (apiError.statusCode === 400) {
          setFieldError('email', apiError.message || 'Please enter a valid email address');
        } else {
          setFieldError('email', apiError.message || 'Failed to send verification code');
        }
      } else {
        setFieldError('email', 'Something went wrong. Please try again.');
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
    <AuthLayout centered>
      <Formik
        initialValues={{ email: data.email || '' }}
        enableReinitialize
        validationSchema={EmailSchema}
        onSubmit={handleContinue}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <>
            <AuthHeader
              title={t('signup.title')}
              imageSource={require('@/assets/images/icon-signup-email.svg')}
              imageWidth={IMAGE_DIMENSIONS.SIGNUP_EMAIL.width}
              imageHeight={IMAGE_DIMENSIONS.SIGNUP_EMAIL.height}
            />

            <Input
              label={t('auth.email')}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && errors.email ? errors.email : undefined}
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={theme.placeholder}
            />

            <Button
              disabled={!values.email || !!errors.email || isSubmitting}
              onPress={() => handleSubmit()}
              accessibilityLabel={t('common.continue')}>
              {isSubmitting ? t('common.sending') : t('common.continue')}
            </Button>

            <SignInFooter
              onGooglePress={handleGoogleAuth}
              onApplePress={handleAppleAuth}
              onSignInPress={handleGoToLogin}
              showSignInLink
            />
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}
