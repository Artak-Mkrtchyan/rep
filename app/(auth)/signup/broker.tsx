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

import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { NumberPicker } from '@/components/ui/number-picker';
import { PhoneInput } from '@/components/ui/phone-input';
import { applicationsService } from '@/lib/api/applications';
import { FULL_NAME_MAX_LENGTH, yupSchemas } from '@/lib/auth-validation';
import i18n from '@/lib/i18n/i18n';
import type { BrokerSignUpForm } from '@/types/auth';
import { router } from 'expo-router';

const BrokerSchema = Yup.object().shape({
  email: yupSchemas.email,
  fullName: yupSchemas.fullName,
  attachments: Yup.array().min(1).required('Required'),
  certifiedBy: Yup.string()
    .optional()
    .max(255, () => i18n.t('validation.max_length_255')),
  certifiedOn: yupSchemas.certifiedOn,
  phoneNumber: yupSchemas.phone,
  yearsOfActivity: Yup.number().required(),
});

export default function BrokerSignUpScreen() {
  const { t } = useTranslation();
  const { data, resetData } = useSignUpContext();

  const handleContinue = async (
    values: BrokerSignUpForm & {
      attachments: { id: string; uri: string; type?: string; name?: string }[];
    },
    { setSubmitting }: any
  ) => {
    try {
      const attachmentIds = values.attachments.map((attachment) => attachment.id);

      await applicationsService.brokerRegistration({
        fullName: values.fullName,
        email: values.email,
        attachmentIds,
        certifiedBy: values.certifiedBy,
        certifiedOn: values.certifiedOn,
        phoneNumber: values.phoneNumber,
        yearsOfActivity: values.yearsOfActivity,
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
          fullName: '',
          attachments: [],
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
          setFieldTouched,
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

            <View className="w-full gap-5">
              <Input
                label={t('auth.email')}
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
                label={t('auth.full_name')}
                required
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName ? errors.fullName : undefined}
                placeholder=""
                maxLength={FULL_NAME_MAX_LENGTH}
              />

              <DatePicker
                label={t('signup.broker.certified_on')}
                required
                value={values.certifiedOn}
                onChange={(date) => {
                  setFieldValue('certifiedOn', date);
                }}
                onBlur={() => setFieldTouched('certifiedOn', true, false)}
                maximumDate={new Date()}
                error={touched.certifiedOn && errors.certifiedOn ? errors.certifiedOn : undefined}
              />

              <Input
                label={t('signup.broker.certified_by')}
                value={values.certifiedBy}
                onChangeText={handleChange('certifiedBy')}
                onBlur={handleBlur('certifiedBy')}
                error={touched.certifiedBy && errors.certifiedBy ? errors.certifiedBy : undefined}
                placeholder=""
                maxLength={255}
              />

              <PhoneInput
                label={t('auth.phone_number')}
                required
                value={values.phoneNumber}
                onChangeText={(text) => setFieldValue('phoneNumber', text)}
                onBlur={handleBlur('phoneNumber')}
                error={touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : undefined}
              />

              <NumberPicker
                label={t('signup.broker.years_of_activity')}
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
                label={t('signup.broker.files_upload')}
                hint={t('ui.upload_your_photo')}
                description={t('signup.broker.files_description')}
                value={values.attachments}
                onChange={(attachments) => setFieldValue('attachments', attachments)}
                required
                error={
                  touched.attachments && errors.attachments ? String(errors.attachments) : undefined
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
