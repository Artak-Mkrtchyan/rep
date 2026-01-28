import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { RadioButton } from '@/components/auth/radio-button';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ACCOUNT_TYPE_OPTIONS, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';
import { useSignUpFlow } from '@/hooks/use-signup-flow';

import type { AccountRole } from '@/types/auth';

const SignUpSchema = Yup.object().shape({
  role: Yup.string().required('Required'),
});

export default function SignUpFirstScreen() {
  const { data, updateData } = useSignUpContext();
  const { goToNext } = useSignUpFlow();

  const handleContinue = (values: { role: AccountRole }) => {
    switch (values.role) {
      case 'broker':
        updateData({ role: values.role });
        goToNext();
        break;
      case 'individual':
      case 'company':
    }
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
              title="Sign up"
              imageSource={require('@/assets/images/signup-illustration.svg')}
              imageWidth={IMAGE_DIMENSIONS.SIGNUP_ILLUSTRATION.width}
              imageHeight={IMAGE_DIMENSIONS.SIGNUP_ILLUSTRATION.height}
            />

            <View className="w-full gap-4">
              <ThemedText className="text-[14px] text-muted-foreground">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry&rsquo;s standard dummy text ever since the 1500s, when
                an unknown printer took.
              </ThemedText>

              <View className="gap-3">
                <Select
                  label="Account type"
                  placeholder="Select"
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  options={ACCOUNT_TYPE_OPTIONS}
                />

                {values.role === 'broker' && (
                  <View className="flex-row items-center justify-between">
                    <RadioButton
                      value="broker"
                      label="Individual broker"
                      selectedValue={values.role}
                      onSelect={(value) => setFieldValue('role', value)}
                    />
                    <RadioButton
                      value="company"
                      label="Broker company"
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
              accessibilityLabel="Continue">
              Continue
            </Button>
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}
