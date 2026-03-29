import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';
import { ERROR_MESSAGES, showErrorAlert } from '@/lib/error-handler';
import i18n from '@/lib/i18n/i18n';

import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { NumberPicker } from '@/components/ui/number-picker';
import { PhoneInput } from '@/components/ui/phone-input';
import { applicationsService, BrokerCompanyRegistrationRequest } from '@/lib/api/applications';
import { FULL_NAME_MAX_LENGTH, yupSchemas } from '@/lib/auth-validation';
import { router } from 'expo-router';

const BrokerCompanySchema = Yup.object().shape({
  attachmentIds: Yup.array().min(1, () => i18n.t('validation.at_least_one_file')).required(() => i18n.t('validation.required')),
  companyInfo: Yup.object().shape({
    certifiedBy: Yup.string().optional().max(255, () => i18n.t('validation.max_length_255')),
    certifiedOn: yupSchemas.certifiedOn,
    email: yupSchemas.email,
    name: Yup.string().required(() => i18n.t('validation.required')),
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
  const { t } = useTranslation();
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
    } catch (error) {
      showErrorAlert(error, { fallback: ERROR_MESSAGES.SUBMIT_FAILED });
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
              title={t('signup.title')}
              imageSource={require('@/assets/images/icon-broker-illustration.svg')}
              imageWidth={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.width}
              imageHeight={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.height}
            />

            <View className="mt-10 w-full gap-5">
              <Input
                label={t('signup.broker_company.manager_email')}
                required
                value={values.managerInfo.email}
                helper={t('signup.broker_company.manager_email_helper')}
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
                label={t('signup.broker_company.manager_name')}
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
                maxLength={FULL_NAME_MAX_LENGTH}
              />

              <PhoneInput
                label={t('signup.broker_company.manager_mobile_number')}
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
                label={t('signup.broker_company.company_email')}
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
                helper={t('signup.broker_company.company_email_helper')}
                autoCorrect={false}
              />

              <Input
                label={t('signup.broker_company.company_name')}
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
                label={t('signup.broker_company.mobile_number')}
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
                label={t('signup.broker_company.certification_date')}
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
                label={t('signup.broker_company.certified_by')}
                value={values.companyInfo.certifiedBy}
                onChangeText={handleChange('companyInfo.certifiedBy')}
                onBlur={handleBlur('companyInfo.certifiedBy')}
                error={
                  touched.companyInfo?.certifiedBy && errors.companyInfo?.certifiedBy
                    ? errors.companyInfo.certifiedBy
                    : undefined
                }
                placeholder=""
                maxLength={255}
              />

              <NumberPicker
                label={t('signup.broker_company.years_of_activity')}
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
                label={t('signup.broker_company.files_upload')}
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
                accessibilityLabel={t('common.continue')}>
                {isSubmitting ? t('common.submitting') : t('common.continue')}
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
