import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormDivider } from '@/components/auth/form-divider';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { AUTH_ROUTES, IMAGE_DIMENSIONS, YEARS_OF_ACTIVITY_OPTIONS } from '@/constants/auth';

import type { BrokerSignUpForm, YearsOfActivity } from '@/types/auth';

const FILE_UPLOAD_HEIGHT = 142;

const BrokerSchema = Yup.object().shape({
  fullName: Yup.string().required('Required'),
  companyName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  yearsOfActivity: Yup.string().required('Required'),
  filesCount: Yup.number().min(1, 'At least one file is required').required(),
});

export default function BrokerSignUpScreen() {
  const params = useLocalSearchParams();

  const handleContinue = (values: BrokerSignUpForm) => {
    router.push({
      pathname: AUTH_ROUTES.SIGNUP_PASSWORD,
      params: {
        ...params,
        ...values,
      },
    });
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
          fullName: '',
          companyName: '',
          email: '',
          phone: '',
          yearsOfActivity: '' as YearsOfActivity,
          filesCount: 0,
        }}
        validationSchema={BrokerSchema}
        onSubmit={handleContinue}>
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <>
            <AuthHeader
              title="Sign up"
              imageSource={require('@/assets/images/icon-broker-illustration.svg')}
              imageWidth={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.width}
              imageHeight={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.height}
            />

            <View className="w-full gap-4">
              <Input
                label="Full name"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName ? errors.fullName : undefined}
                placeholder=""
              />

              <Input
                label="Company name"
                value={values.companyName}
                onChangeText={handleChange('companyName')}
                onBlur={handleBlur('companyName')}
                error={touched.companyName && errors.companyName ? errors.companyName : undefined}
                placeholder=""
              />

              <Input
                label="Company email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email ? errors.email : undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder=""
              />

              <Input
                label="Phone number"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                error={touched.phone && errors.phone ? errors.phone : undefined}
                keyboardType="phone-pad"
                placeholder=""
              />

              <View className="gap-2">
                <View className="flex-row items-center">
                  <ThemedText className="text-[12px] font-bold leading-[11px] text-foreground">
                    Years of activity
                  </ThemedText>
                  <Text className="ml-1 text-[12px] leading-[11px] text-primary">*</Text>
                </View>
                <Select
                  placeholder="Select a range"
                  value={values.yearsOfActivity}
                  onChange={(value) => setFieldValue('yearsOfActivity', value)}
                  options={YEARS_OF_ACTIVITY_OPTIONS}
                />
                {touched.yearsOfActivity && errors.yearsOfActivity && (
                  <ThemedText className="text-[12px] text-destructive">
                    {errors.yearsOfActivity}
                  </ThemedText>
                )}
              </View>

              <View className="mt-2 gap-2">
                <View className="flex-row items-center">
                  <ThemedText className="text-[12px] font-bold leading-[11px] text-foreground">
                    Files upload
                  </ThemedText>
                  <Text className="ml-1 text-[12px] leading-[11px] text-primary">*</Text>
                </View>
                <ThemedText className="text-[12px] text-muted-foreground">
                  Please attach your brokerage license or proof of authorization
                </ThemedText>

                <View
                  className="w-full items-center justify-center rounded-[12px] border border-default bg-card"
                  style={{ height: FILE_UPLOAD_HEIGHT }}>
                  <View className="items-center">
                    <View className="mb-3 h-11 w-11 items-center justify-center rounded-full border border-default">
                      <Text className="text-[18px] text-muted-foreground">+</Text>
                    </View>
                    <ThemedText className="text-[12px] text-muted-foreground">
                      Upload your photo
                    </ThemedText>
                    {values.filesCount > 0 && (
                      <ThemedText className="mt-2 text-[12px] text-primary">
                        {values.filesCount} file(s) selected
                      </ThemedText>
                    )}
                  </View>
                </View>

                <View className="items-center">
                  <Pressable
                    onPress={() => setFieldValue('filesCount', values.filesCount + 1)}
                    className="mt-3 h-9 items-center justify-center rounded-[10px] border border-default bg-card px-5"
                    accessibilityRole="button"
                    accessibilityLabel="Upload file">
                    <ThemedText className="text-[14px]">Choose file</ThemedText>
                  </Pressable>
                  {touched.filesCount && errors.filesCount && (
                    <ThemedText className="mt-1 text-[12px] text-destructive">
                      {errors.filesCount}
                    </ThemedText>
                  )}
                </View>
              </View>
            </View>

            <Button
              disabled={
                !values.fullName ||
                !values.companyName ||
                !values.email ||
                !values.phone ||
                !values.yearsOfActivity ||
                values.filesCount === 0
              }
              onPress={() => handleSubmit()}
              accessibilityLabel="Continue">
              Continue
            </Button>

            <FormDivider />

            <SocialAuthButtons onGooglePress={handleGoogleAuth} onApplePress={handleAppleAuth} />
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}
