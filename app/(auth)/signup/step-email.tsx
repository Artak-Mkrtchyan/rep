import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormDivider } from '@/components/auth/form-divider';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';
import { useSignUpFlow } from '@/hooks/use-signup-flow';
import { useTheme } from '@/hooks/use-theme';
import { authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/auth.types';
import { useRouter } from 'expo-router';

const EmailSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
});

export default function SignUpEmailStepScreen() {
  const { tokens: theme } = useTheme();
  const { data, updateData } = useSignUpContext();
  const { goToNext } = useSignUpFlow();
  const router = useRouter();

  const handleContinue = async (
    values: { email: string },
    { setFieldError, setSubmitting }: any
  ) => {
    try {
      await authService.requestEmailConfirmation(values.email);

      updateData({ email: values.email });

      goToNext();
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        const apiError = error as ApiError;

        if (apiError.errors?.email) {
          setFieldError('email', apiError.errors.email[0]);
        } else {
          setFieldError('email', apiError.message || 'Failed to send verification code');
        }
      } else {
        setFieldError('email', 'An unexpected error occurred');
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
              title="Sign up"
              imageSource={require('@/assets/images/icon-signup-email.svg')}
              imageWidth={IMAGE_DIMENSIONS.SIGNUP_EMAIL.width}
              imageHeight={IMAGE_DIMENSIONS.SIGNUP_EMAIL.height}
            />

            <Input
              label="Email"
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
              accessibilityLabel="Continue">
              {isSubmitting ? 'Sending...' : 'Continue'}
            </Button>

            <FormDivider />

            <SocialAuthButtons onGooglePress={handleGoogleAuth} onApplePress={handleAppleAuth} />

            <Button
              variant="ghost"
              onPress={handleGoToLogin}
              accessibilityLabel="Already have an account? Log in">
              <ThemedText className="text-[16px] text-primary">Already have an account?</ThemedText>
            </Button>
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}
