import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { getAccountTypeOptions, AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import i18n from '@/lib/i18n/i18n';

import type { AccountRole } from '@/types/auth';

const LoginRoleSchema = Yup.object().shape({
  role: Yup.string().required(() => i18n.t('validation.required')),
});

export default function LoginRoleScreen() {
  const { t } = useTranslation();

  const handleContinue = (values: { role: AccountRole }) => {
    router.push({
      pathname: AUTH_ROUTES.LOGIN_FORM as any,
      params: { role: values.role },
    });
  };

  const handleGoogleSignIn = () => {
    Alert.alert(t('login.google_sign_in_title'), t('login.google_sign_in_message'));
  };

  const handleAppleSignIn = () => {
    Alert.alert(t('login.apple_sign_in_title'), t('login.apple_sign_in_message'));
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
              title={t('login.title')}
              imageSource={require('@/assets/images/login-illustration.svg')}
              imageWidth={IMAGE_DIMENSIONS.LOGIN_ILLUSTRATION.width}
              imageHeight={IMAGE_DIMENSIONS.LOGIN_ILLUSTRATION.height}
              description={t('login.description')}
            />

            <View className="w-full">
              <Select
                label={t('login.log_in_as')}
                placeholder={t('common.select')}
                value={values.role}
                onChange={(value) => setFieldValue('role', value)}
                options={getAccountTypeOptions(t)}
              />
            </View>

            <Button
              disabled={!values.role}
              onPress={() => handleSubmit()}
              accessibilityLabel={t('common.continue')}>
              {t('common.continue')}
            </Button>

            <SignInFooter
              onGooglePress={handleGoogleSignIn}
              onApplePress={handleAppleSignIn}
              onSignInPress={() => router.push('/(auth)/signup')}
              showSignInLink
              signInLabel={t('auth.dont_have_account')}
              signInActionLabel={t('auth.sign_up')}
            />
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}
