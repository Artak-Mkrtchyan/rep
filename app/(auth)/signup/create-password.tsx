import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormDivider } from '@/components/auth/form-divider';
import { PasswordRequirementsList } from '@/components/auth/password-requirements';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES } from '@/constants/auth';
import { useTheme } from '@/hooks/use-theme';
import { validatePassword, PASSWORD_MIN_LENGTH } from '@/lib/auth-validation';

import type { PasswordForm } from '@/types/auth';

const PasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, 'Password too short')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/\d/, 'Must contain number')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Required'),
});

export default function CreatePasswordScreen() {
  const { tokens: theme } = useTheme();
  const params = useLocalSearchParams();

  const handleContinue = (values: PasswordForm) => {
    // Here we would typically make the API call to register the user
    // using all collected data from params + current values
    console.log('Final Registration Data:', { ...params, ...values });

    router.push(AUTH_ROUTES.SIGNUP_COMPLETED);
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
    <AuthLayout>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={PasswordSchema}
        onSubmit={handleContinue}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
          const passwordRequirements = validatePassword(values.password);

          return (
            <>
              <AuthHeader
                title="Sign up"
                imageSource={require('@/assets/images/signup-illustration.svg')}
                imageWidth={170}
                imageHeight={113}
              />

              <Input
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email ? errors.email : undefined}
                placeholder=""
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={theme.placeholder}
              />

              <Input
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password && errors.password ? errors.password : undefined}
                secureTextEntry
                placeholder=""
                placeholderTextColor={theme.placeholder}
              />

              <PasswordRequirementsList
                hasMinLength={passwordRequirements.hasMinLength}
                hasUpperCase={passwordRequirements.hasUpperCase}
                hasNumber={passwordRequirements.hasNumber}
              />

              <Input
                label="Confirm password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                isInvalid={!!(touched.confirmPassword && errors.confirmPassword)}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : undefined
                }
                secureTextEntry
                placeholder=""
                placeholderTextColor={theme.placeholder}
              />

              <Button
                disabled={
                  !values.email ||
                  !values.password ||
                  !values.confirmPassword ||
                  Object.keys(errors).length > 0
                }
                onPress={() => handleSubmit()}
                accessibilityLabel="Continue">
                Continue
              </Button>

              <FormDivider />

              <SocialAuthButtons onGooglePress={handleGoogleAuth} onApplePress={handleAppleAuth} />

              <Button
                variant="ghost"
                onPress={handleGoToLogin}
                accessibilityLabel="Already have an account? Log in">
                <ThemedText className="text-[16px] text-primary">
                  Already have an account?
                </ThemedText>
              </Button>
            </>
          );
        }}
      </Formik>
    </AuthLayout>
  );
}
