import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import { AuthLayout } from '@/components/auth/auth-layout';
import { PasswordRequirementsList } from '@/components/auth/password-requirements';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES } from '@/constants/auth';
import { useTheme } from '@/hooks/use-theme';
import { PASSWORD_MIN_LENGTH, validatePassword } from '@/lib/auth-validation';

import { PhoneInput } from '@/components/ui/phone-input';
import { useSignUpContext } from '@/context/SignUpContext';
import { authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/auth.types';
import type { PasswordForm } from '@/types/auth';
import { Alert } from 'react-native';

const PasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  fullName: Yup.string().required('Required'),
  phone: Yup.string()
    .required('Required')
    .matches(/^\+998\d{9}$/, 'Invalid phone number'),
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, 'Password too short')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[a-z]/, 'Must contain lowercase')
    .matches(/\d/, 'Must contain number')
    .matches(/[^A-Za-z0-9]/, 'Must contain symbol')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Required'),
});

export default function CreatePasswordScreen() {
  const { tokens: theme } = useTheme();
  const { data, resetData } = useSignUpContext();

  const handleContinue = async (values: PasswordForm, { setSubmitting, setFieldError }: any) => {
    try {
      await authService.createUsualUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });

      resetData();

      router.push(AUTH_ROUTES.SIGNUP_COMPLETED);
    } catch (error) {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const apiError = error as ApiError;

        if (apiError.errors) {
          (Object.entries(apiError.errors) as [string, string[]][]).forEach(([field, messages]) => {
            if (messages?.[0]) {
              setFieldError(field, messages[0]);
            }
          });
        } else {
          Alert.alert(
            'Error',
            apiError.message || 'An unexpected error occurred. Please try again.'
          );
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
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
          email: data.email || '',
          password: '',
          confirmPassword: '',
          fullName: '',
          phone: '',
        }}
        validationSchema={PasswordSchema}
        onSubmit={handleContinue}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => {
          const passwordRequirements = validatePassword(values.password);

          return (
            <>
              <ThemedText type="title" className="mt-10 text-center">
                Sign up
              </ThemedText>

              <Input
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email ? errors.email : undefined}
                placeholder=""
                disabled
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={theme.placeholder}
              />

              <Input
                label="Full name"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName ? errors.fullName : undefined}
                placeholder=""
              />

              <PhoneInput
                label="Phone number"
                value={values.phone}
                onChangeText={(text) => handleChange('phone')(text)}
                onBlur={handleBlur('phone')}
                error={touched.phone && errors.phone ? errors.phone : undefined}
              />

              <Input
                label="Password"
                value={values.password}
                showPasswordToggle
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
                hasLowerCase={passwordRequirements.hasLowerCase}
                hasNumber={passwordRequirements.hasNumber}
                hasSymbol={passwordRequirements.hasSymbol}
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
                showPasswordToggle
                placeholder=""
                placeholderTextColor={theme.placeholder}
              />

              <Button
                disabled={Object.keys(errors).length !== 0 || isSubmitting}
                onPress={() => handleSubmit()}
                accessibilityLabel="Continue">
                Continue
              </Button>

              <SignInFooter
                onGooglePress={handleGoogleAuth}
                onApplePress={handleAppleAuth}
                onSignInPress={handleGoToLogin}
                showSignInLink
              />
            </>
          );
        }}
      </Formik>
    </AuthLayout>
  );
}
