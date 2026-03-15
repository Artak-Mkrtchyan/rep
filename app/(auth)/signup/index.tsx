import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { RadioButton } from '@/components/auth/radio-button';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { getAccountTypeOptions, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';
import { useSignUpFlow } from '@/hooks/use-signup-flow';

import type { AccountRole } from '@/types/auth';

const SignUpSchema = Yup.object().shape({
  role: Yup.string().required('Required'),
});

export default function SignUpFirstScreen() {
  const { t } = useTranslation();
  const { data, updateData } = useSignUpContext();
  const { goToNext } = useSignUpFlow();

  const handleContinue = (values: { role: AccountRole }) => {
    updateData({ role: values.role });
    goToNext();
  };

  return (
    <AuthLayout centered>
      <Formik
        initialValues={{ role: (data.role || '') as AccountRole }}
        enableReinitialize
        validationSchema={SignUpSchema}
        onSubmit={handleContinue}>
        {({ handleSubmit, values, setFieldValue }) => (
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
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  options={getAccountTypeOptions(t)}
                />

                {(values.role === 'broker' || values.role === 'broker_company') && (
                  <View className="flex-row items-center justify-between">
                    <RadioButton
                      value="broker"
                      label={t('signup.individual_broker')}
                      selectedValue={values.role}
                      onSelect={(value) => setFieldValue('role', value)}
                    />
                    <RadioButton
                      value="broker_company"
                      label={t('signup.broker_company')}
                      selectedValue={values.role}
                      onSelect={(value) => setFieldValue('role', value)}
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
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}
