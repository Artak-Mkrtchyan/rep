import { Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormDivider } from '@/components/auth/form-divider';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';

import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { NumberPicker } from '@/components/ui/number-picker';
import { PhoneInput } from '@/components/ui/phone-input';
import { applicationsService } from '@/lib/api/applications';
import type { BrokerSignUpForm } from '@/types/auth';
import { router } from 'expo-router';

const BrokerSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  fullName: Yup.string().required('Required'),
  attachmentIds: Yup.array().min(1).required('Required'),
  certifiedBy: Yup.string().required('Required'),
  certifiedOn: Yup.string()
    .required('Required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date in incorrect format'),
  phoneNumber: Yup.string().required('Required'),
  yearsOfActivity: Yup.number().required(),
});

export default function BrokerSignUpScreen() {
  const { data, resetData } = useSignUpContext();

  const handleContinue = async (values: BrokerSignUpForm, { setSubmitting }: any) => {
    try {
      await applicationsService.brokerRegistration({
        fullName: values.fullName,
        email: values.email,
        attachmentIds: values.attachmentIds,
        certifiedBy: values.certifiedBy,
        certifiedOn: values.certifiedOn,
        phoneNumber: values.phoneNumber,
        yearsOfActivity: values.yearsOfActivity,
      });

      resetData();

      router.push(AUTH_ROUTES.SIGNUP_COMPLETED);
    } catch {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
          email: data.email || '',
          attachmentIds: [],
          certifiedBy: '',
          certifiedOn: '',
          phoneNumber: '',
          yearsOfActivity: 0,
        }}
        enableReinitialize
        validationSchema={BrokerSchema}
        onSubmit={handleContinue}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <AuthHeader
              title="Sign up"
              imageSource={require('@/assets/images/icon-broker-illustration.svg')}
              imageWidth={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.width}
              imageHeight={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.height}
            />

            <View className="w-full gap-4">
              <Input
                label="Email"
                value={values.email}
                disabled
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email ? errors.email : undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                label="Full name"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName ? errors.fullName : undefined}
                placeholder=""
              />

              <DatePicker
                label="Certified on"
                value={values.certifiedOn}
                onChange={(date) => setFieldValue('certifiedOn', date)}
                error={touched.certifiedOn && errors.certifiedOn ? errors.certifiedOn : undefined}
              />

              <Input
                label="Certified by"
                value={values.certifiedBy}
                onChangeText={handleChange('certifiedBy')}
                onBlur={handleBlur('certifiedBy')}
                error={touched.certifiedBy && errors.certifiedBy ? errors.certifiedBy : undefined}
                placeholder=""
              />

              <PhoneInput
                label="Phone number"
                value={values.phoneNumber}
                onChangeText={(text) => setFieldValue('phoneNumber', text)}
                onBlur={handleBlur('phoneNumber')}
                error={touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : undefined}
              />

              <NumberPicker
                label="Years of activity"
                value={values.yearsOfActivity}
                onChange={(value) => setFieldValue('yearsOfActivity', value)}
                min={0}
                max={50}
                step={1}
                required
                error={
                  touched.yearsOfActivity && errors.yearsOfActivity
                    ? String(errors.yearsOfActivity)
                    : undefined
                }
              />

              <FileUpload
                label="Files upload"
                description="Please attach your brokerage license or proof of authorization"
                value={values.attachmentIds}
                onChange={(attachmentIds) => setFieldValue('attachmentIds', attachmentIds)}
                required
                error={
                  touched.attachmentIds && errors.attachmentIds
                    ? String(errors.attachmentIds)
                    : undefined
                }
              />
            </View>

            <Button
              disabled={Object.keys(errors).length !== 0 || isSubmitting}
              onPress={() => handleSubmit()}
              accessibilityLabel="Continue">
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </Button>

            <FormDivider />

            <SocialAuthButtons onGooglePress={handleGoogleAuth} onApplePress={handleAppleAuth} />
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}
