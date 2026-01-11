import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormDivider } from '@/components/auth/form-divider';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useTheme } from '@/hooks/use-theme';

import type { AccountRole } from '@/types/auth';

const EmailSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
});

export default function SignUpEmailStepScreen() {
  const { tokens: theme } = useTheme();
  const params = useLocalSearchParams<{ role: AccountRole }>();

  const handleContinue = (values: { email: string }) => {
    router.push({
      pathname: AUTH_ROUTES.SIGNUP_VERIFY,
      params: {
        role: params.role,
        email: values.email,
      },
    });
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
        initialValues={{ email: '' }}
        validationSchema={EmailSchema}
        onSubmit={handleContinue}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
              disabled={!values.email || !!errors.email}
              onPress={() => handleSubmit()}
              accessibilityLabel="Continue">
              Continue
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
