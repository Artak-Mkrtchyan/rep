import { Formik } from 'formik';
import React from 'react';
import { Alert, View } from 'react-native';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';

import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  applicationsService,
  ConstructionCompanyRegistrationRequest,
} from '@/lib/api/applications';
import { yupSchemas } from '@/lib/auth-validation';
import { router } from 'expo-router';

const CURRENT_YEAR = new Date().getFullYear();
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const ConstructionCompanySchema = Yup.object().shape({
  attachmentIds: Yup.array().min(1, 'At least one file is required').required('Required'),
  companyInfo: Yup.object().shape({
    certifiedOn: Yup.string()
      .required('Required')
      .matches(DATE_REGEX, 'Date in incorrect format')
      .test('not-future-date', 'Date cannot be in the future', (value) => {
        if (!value || !DATE_REGEX.test(value)) return true;
        return new Date(value) <= new Date();
      }),
    certifiedBy: Yup.string().optional().max(255, 'Must be no more than 255 characters'),
    email: yupSchemas.email,
    name: Yup.string().required('Required').max(255, 'Must be no more than 255 characters'),
    phoneNumber: yupSchemas.phone,
    constructionYearsStart: Yup.number()
      .required('Required')
      .min(1900, 'Must be at least 1900')
      .max(CURRENT_YEAR, `Must be no more than ${CURRENT_YEAR}`)
      .integer('Must be a whole number'),
    constructionYearsEnd: Yup.number()
      .required('Required')
      .min(1900, 'Must be at least 1900')
      .max(CURRENT_YEAR, `Must be no more than ${CURRENT_YEAR}`)
      .integer('Must be a whole number')
      .test(
        'end-after-start',
        'End year must be greater than or equal to start year',
        function (value) {
          const { constructionYearsStart } = this.parent;
          if (!value || !constructionYearsStart) return true;
          return value >= constructionYearsStart;
        }
      ),
  }),
  managerInfo: Yup.object().shape({
    email: yupSchemas.email,
    fullName: yupSchemas.fullName,
    phoneNumber: yupSchemas.phoneOptional,
  }),
});

export default function ConstructionCompanySignUpScreen() {
  const { data, resetData } = useSignUpContext();

  const handleContinue = async (
    values: ConstructionCompanyRegistrationRequest,
    { setSubmitting }: any
  ) => {
    try {
      await applicationsService.constructionCompanyRegistration({
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
            constructionYearsStart: '' as unknown as number,
            constructionYearsEnd: '' as unknown as number,
          },
          managerInfo: {
            email: data.email || '',
            fullName: '',
            phoneNumber: '',
          },
        }}
        enableReinitialize
        validationSchema={ConstructionCompanySchema}
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
              imageWidth={IMAGE_DIMENSIONS.CONSTRUCTION_ILLUSTRATION.width}
              imageHeight={IMAGE_DIMENSIONS.CONSTRUCTION_ILLUSTRATION.height}
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
                required
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
                required
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
                maximumDate={new Date()}
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

              <View className="gap-2">
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Input
                      label="Construction years"
                      required
                      placeholder="From"
                      value={
                        values.companyInfo.constructionYearsStart !== ('' as unknown as number)
                          ? String(values.companyInfo.constructionYearsStart)
                          : ''
                      }
                      onChangeText={(text) =>
                        setFieldValue(
                          'companyInfo.constructionYearsStart',
                          text === '' ? ('' as unknown as number) : Number(text)
                        )
                      }
                      onBlur={handleBlur('companyInfo.constructionYearsStart')}
                      keyboardType="number-pad"
                      maxLength={4}
                      error={
                        touched.companyInfo?.constructionYearsStart &&
                        errors.companyInfo?.constructionYearsStart
                          ? String(errors.companyInfo.constructionYearsStart)
                          : undefined
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Input
                      label=" "
                      placeholder="To"
                      value={
                        values.companyInfo.constructionYearsEnd !== ('' as unknown as number)
                          ? String(values.companyInfo.constructionYearsEnd)
                          : ''
                      }
                      onChangeText={(text) =>
                        setFieldValue(
                          'companyInfo.constructionYearsEnd',
                          text === '' ? ('' as unknown as number) : Number(text)
                        )
                      }
                      onBlur={handleBlur('companyInfo.constructionYearsEnd')}
                      keyboardType="number-pad"
                      maxLength={4}
                      error={
                        touched.companyInfo?.constructionYearsEnd &&
                        errors.companyInfo?.constructionYearsEnd
                          ? String(errors.companyInfo.constructionYearsEnd)
                          : undefined
                      }
                    />
                  </View>
                </View>
              </View>

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

              <SignInFooter
                onGooglePress={handleGoogleAuth}
                onApplePress={handleAppleAuth}
                onSignInPress={handleGoToLogin}
                showSignInLink
              />
            </View>
          </View>
        )}
      </Formik>
    </AuthLayout>
  );
}
