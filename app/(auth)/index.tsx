import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { RadioButton } from '@/components/auth/radio-button';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  AUTH_ROUTES,
  IMAGE_DIMENSIONS,
  getAccountTypeOptions,
  isBrokerRole,
} from '@/constants/auth';
import i18n from '@/lib/i18n/i18n';

import type { AccountRole } from '@/types/auth';

const LoginRoleSchema = Yup.object().shape({
  role: Yup.string().required(() => i18n.t('validation.required')),
});

export default function LoginRoleScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const canGoBack = router.canGoBack();

  const handleContinue = (values: { role: AccountRole }) => {
    router.push({
      pathname: AUTH_ROUTES.LOGIN_FORM as any,
      params: { role: values.role },
    });
  };

  return (
    <AuthLayout centered>
      {canGoBack && (
        <Pressable
          onPress={() => router.back()}
          className="absolute left-0 h-10 items-center justify-center"
          style={{ top: insets.top + 12, zIndex: 10 }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('common.go_back')}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </Pressable>
      )}
      <Formik
        initialValues={{ role: '' as AccountRole }}
        validationSchema={LoginRoleSchema}
        onSubmit={handleContinue}>
        {({ handleSubmit, values, setFieldValue }) => {
          const showBrokerRadios = isBrokerRole(values.role);
          const setRole = (value: string) => setFieldValue('role', value);
          // Picking 'broker' from the dropdown defaults role to individual broker;
          // the radios below let the user switch to 'broker_company'.
          const dropdownValue = showBrokerRadios ? 'broker' : values.role;

          return (
            <>
              <AuthHeader
                title={t('login.title')}
                imageSource={require('@/assets/images/login-illustration.svg')}
                imageWidth={IMAGE_DIMENSIONS.LOGIN_ILLUSTRATION.width}
                imageHeight={IMAGE_DIMENSIONS.LOGIN_ILLUSTRATION.height}
                description={t('login.description')}
              />

              <View className="w-full gap-3">
                <Select
                  label={t('login.log_in_as')}
                  placeholder={t('common.select')}
                  value={dropdownValue}
                  onChange={setRole}
                  options={getAccountTypeOptions(t)}
                />

                {showBrokerRadios && (
                  <View className="flex-row items-center justify-between">
                    <RadioButton
                      value="broker"
                      label={t('signup.individual_broker')}
                      selectedValue={values.role}
                      onSelect={setRole}
                    />
                    <RadioButton
                      value="broker_company"
                      label={t('signup.broker_company')}
                      selectedValue={values.role}
                      onSelect={setRole}
                    />
                  </View>
                )}
              </View>

              <Button
                disabled={!values.role}
                onPress={() => handleSubmit()}
                accessibilityLabel={t('common.continue')}>
                {t('common.continue')}
              </Button>

              <SignInFooter
                onSignInPress={() => router.push('/(auth)/signup')}
                showSignInLink
                signInLabel={t('auth.dont_have_account')}
                signInActionLabel={t('auth.sign_up')}
              />
            </>
          );
        }}
      </Formik>
    </AuthLayout>
  );
}
