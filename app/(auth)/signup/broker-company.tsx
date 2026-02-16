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
import { applicationsService, BrokerCompanyRegistrationRequest } from '@/lib/api/applications';
import { yupSchemas } from '@/lib/auth-validation';
import { router } from 'expo-router';

const BrokerCompanySchema = Yup.object().shape({
  attachmentIds: Yup.array().min(1, 'At least one file is required').required('Required'),
  companyInfo: Yup.object().shape({
    certifiedOn: yupSchemas.certifiedOn,
    email: yupSchemas.email,
    name: Yup.string().required('Required'),
    phoneNumber: yupSchemas.phone,
    yearsOfActivity: Yup.number().required('Required'),
  }),
  managerInfo: Yup.object().shape({
    email: yupSchemas.email,
    fullName: yupSchemas.fullName,
    phoneNumber: yupSchemas.phone,
  }),
});

export default function BrokerSignUpScreen() {
  const { data, resetData } = useSignUpContext();

  const handleContinue = async (
    values: BrokerCompanyRegistrationRequest,
    { setSubmitting }: any
  ) => {
    try {
      await applicationsService.brokerCompanyRegistration({
        attachmentIds: values.attachmentIds,
        companyInfo: values.companyInfo,
        managerInfo: values.managerInfo,
      });

      resetData();

      router.push(AUTH_ROUTES.APPLICATION_SUBMITTED);
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
          attachmentIds: [],
          companyInfo: {
            certifiedBy: '',
            certifiedOn: '',
            email: '',
            name: '',
            phoneNumber: '',
            yearsOfActivity: 0,
          },
          managerInfo: {
            email: data.email || '',
            fullName: '',
            phoneNumber: '',
          },
        }}
        enableReinitialize
        validationSchema={BrokerCompanySchema}
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
          <View className="mb-10 mt-10 w-full">
            <AuthHeader
              title="Sign up"
              imageSource={require('@/assets/images/icon-broker-illustration.svg')}
              imageWidth={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.width}
              imageHeight={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.height}
            />

            <View className="mt-10 w-full gap-5">
              <Input
                label="Manager e-mail"
                required
                value={values.managerInfo.email}
                helper="E-mail for verification and access"
                disabled
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={
                  touched.managerInfo?.email && errors.managerInfo?.email
                    ? errors.managerInfo?.email
                    : undefined
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                label="Manager name"
                required
                value={values.managerInfo.fullName}
                onChangeText={handleChange('managerInfo.fullName')}
                onBlur={handleBlur('managerInfo.fullName')}
                error={
                  touched.managerInfo?.fullName && errors.managerInfo?.fullName
                    ? errors.managerInfo.fullName
                    : undefined
                }
                placeholder=""
              />

              <PhoneInput
                label="Manager mobile number"
                value={values.managerInfo.phoneNumber}
                onChangeText={(text) => setFieldValue('managerInfo.phoneNumber', text)}
                onBlur={handleBlur('managerInfo.phoneNumber')}
                error={
                  touched.managerInfo?.phoneNumber && errors.managerInfo?.phoneNumber
                    ? errors.managerInfo.phoneNumber
                    : undefined
                }
              />

              <Input
                label="Company e-mail"
                value={values.companyInfo.email}
                onChangeText={handleChange('companyInfo.email')}
                onBlur={handleBlur('companyInfo.email')}
                error={
                  touched.companyInfo?.email && errors.companyInfo?.email
                    ? errors.companyInfo.email
                    : undefined
                }
                keyboardType="email-address"
                autoCapitalize="none"
                helper="Company e-mail for contact purposes"
                autoCorrect={false}
              />

              <Input
                label="Company name"
                required
                value={values.companyInfo.name}
                onChangeText={handleChange('companyInfo.name')}
                onBlur={handleBlur('companyInfo.name')}
                error={
                  touched.companyInfo?.name && errors.companyInfo?.name
                    ? errors.companyInfo.name
                    : undefined
                }
                placeholder=""
              />

              <PhoneInput
                label="Mobile number"
                value={values.companyInfo.phoneNumber}
                onChangeText={(text) => setFieldValue('companyInfo.phoneNumber', text)}
                onBlur={handleBlur('companyInfo.phoneNumber')}
                error={
                  touched.companyInfo?.phoneNumber && errors.companyInfo?.phoneNumber
                    ? errors.companyInfo.phoneNumber
                    : undefined
                }
              />

              <DatePicker
                label="Company certification date"
                required
                value={values.companyInfo.certifiedOn}
                onChange={(date) => setFieldValue('companyInfo.certifiedOn', date)}
                error={
                  touched.companyInfo?.certifiedOn && errors.companyInfo?.certifiedOn
                    ? errors.companyInfo.certifiedOn
                    : undefined
                }
              />

              <Input
                label="Certified by"
                value={values.companyInfo.certifiedBy}
                onChangeText={handleChange('companyInfo.certifiedBy')}
                onBlur={handleBlur('companyInfo.certifiedBy')}
                error={
                  touched.companyInfo?.certifiedBy && errors.companyInfo?.certifiedBy
                    ? errors.companyInfo.certifiedBy
                    : undefined
                }
                placeholder=""
              />

              <NumberPicker
                label="Company's years of activity"
                value={values.companyInfo.yearsOfActivity}
                onChange={(value) => setFieldValue('companyInfo.yearsOfActivity', value)}
                min={0}
                max={50}
                step={1}
                required
                error={
                  touched.companyInfo?.yearsOfActivity && errors.companyInfo?.yearsOfActivity
                    ? String(errors.companyInfo.yearsOfActivity)
                    : undefined
                }
              />

              <FileUpload
                label="Files upload"
                value={values.attachmentIds}
                onChange={(attachmentIds) => setFieldValue('attachmentIds', attachmentIds)}
                required
                error={
                  touched.attachmentIds && errors.attachmentIds
                    ? String(errors.attachmentIds)
                    : undefined
                }
              />

              <Button
                disabled={Object.keys(errors).length !== 0 || isSubmitting}
                onPress={() => handleSubmit()}
                accessibilityLabel="Continue">
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </Button>

              <FormDivider />

              <SocialAuthButtons onGooglePress={handleGoogleAuth} onApplePress={handleAppleAuth} />
            </View>
          </View>
        )}
      </Formik>
    </AuthLayout>
  );
}
