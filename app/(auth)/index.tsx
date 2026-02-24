import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ACCOUNT_TYPE_OPTIONS, AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';

import type { AccountRole } from '@/types/auth';

const LoginRoleSchema = Yup.object().shape({
  role: Yup.string().required('Required'),
});

export default function LoginRoleScreen() {
  const handleContinue = (values: { role: AccountRole }) => {
    router.push({
      pathname: AUTH_ROUTES.LOGIN_FORM as any,
      params: { role: values.role },
    });
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Google Sign In', 'Google sign in coming soon.');
  };

  const handleAppleSignIn = () => {
    Alert.alert('Apple Sign In', 'Apple sign in coming soon.');
  };

  return (
    <AuthLayout centered>
      <Formik
        initialValues={{ role: '' as AccountRole }}
        validationSchema={LoginRoleSchema}
        onSubmit={handleContinue}>
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <AuthHeader
              title="Log in"
              imageSource={require('@/assets/images/login-illustration.svg')}
              imageWidth={IMAGE_DIMENSIONS.LOGIN_ILLUSTRATION.width}
              imageHeight={IMAGE_DIMENSIONS.LOGIN_ILLUSTRATION.height}
              description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took."
            />

            <View className="w-full">
              <Select
                label="Log in as"
                placeholder="Select"
                value={values.role}
                onChange={(value) => setFieldValue('role', value)}
                options={ACCOUNT_TYPE_OPTIONS}
              />
            </View>

            <Button
              disabled={!values.role}
              onPress={() => handleSubmit()}
              accessibilityLabel="Continue">
              Continue
            </Button>

            <SignInFooter
              onGooglePress={handleGoogleSignIn}
              onApplePress={handleAppleSignIn}
              onSignInPress={() => router.push('/(auth)/signup')}
              showSignInLink
              signInLabel="Don't have an account?"
              signInActionLabel="Sign up"
            />
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}
