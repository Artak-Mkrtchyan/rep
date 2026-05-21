import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { RadioButton } from '@/components/auth/radio-button';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  AUTH_ROUTES,
  IMAGE_DIMENSIONS,
  getAccountTypeOptions,
  isBrokerRole,
} from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';
import { useSignUpFlow } from '@/hooks/use-signup-flow';
import i18n from '@/lib/i18n/i18n';

import type { AccountRole } from '@/types/auth';

const SignUpSchema = Yup.object().shape({
  role: Yup.string().required(() => i18n.t('validation.required')),
});

export default function SignUpFirstScreen() {
  const { t } = useTranslation();
  const { data, updateData, resetData } = useSignUpContext();
  const { goToNext } = useSignUpFlow();

  const handleContinue = (values: { role: AccountRole }) => {
    if (values.role !== data.role) {
      // Role changed — clear previously entered data
      resetData();
    }
    updateData({ role: values.role });
    goToNext();
  };

  const handleGoToLogin = () => {
    router.replace(AUTH_ROUTES.LOGIN);
  };

  return (
    <AuthLayout centered>
      <Formik
        initialValues={{ role: (data.role || '') as AccountRole }}
        enableReinitialize
        validationSchema={SignUpSchema}
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
                title={t('signup.title')}
                imageSource={require('@/assets/images/signup-illustration.svg')}
                imageWidth={IMAGE_DIMENSIONS.SIGNUP_ILLUSTRATION.width}
                imageHeight={IMAGE_DIMENSIONS.SIGNUP_ILLUSTRATION.height}
              />

              <View className="w-full gap-4">
                <ThemedText className="text-[14px] text-muted-foreground">
                  {t('signup.description')}
                </ThemedText>

                <View className="gap-3">
                  <Select
                    label={t('signup.register_as')}
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
              </View>

              <Button
                disabled={!values.role}
                onPress={() => handleSubmit()}
                accessibilityLabel={t('common.continue')}>
                {t('common.continue')}
              </Button>

              <SignInFooter onSignInPress={handleGoToLogin} showSignInLink />
            </>
          );
        }}
      </Formik>
    </AuthLayout>
  );
}
