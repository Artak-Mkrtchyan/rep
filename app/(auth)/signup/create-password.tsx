import { router } from 'expo-router';
import React from 'react';

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
import { doPasswordsMatch, isPasswordValid, validatePassword } from '@/lib/auth-validation';

export default function CreatePasswordScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const { tokens: theme } = useTheme();

  const passwordRequirements = validatePassword(password);
  const isPasswordCorrect = isPasswordValid(passwordRequirements);
  const passwordsMatch = doPasswordsMatch(password, confirmPassword);
  const canContinue = email.length > 0 && isPasswordCorrect && passwordsMatch;

  const handleContinue = () => {
    if (!canContinue) return;
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
      <AuthHeader
        title="Sign up"
        imageSource={require('@/assets/images/signup-illustration.svg')}
        imageWidth={170}
        imageHeight={113}
      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder=""
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={theme.placeholder}
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
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
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder=""
        isInvalid={confirmPassword.length > 0 && !passwordsMatch}
        error={confirmPassword.length > 0 && !passwordsMatch ? 'Passwords do not match' : undefined}
        placeholderTextColor={theme.placeholder}
      />

      <Button disabled={!canContinue} onPress={handleContinue} accessibilityLabel="Continue">
        Continue
      </Button>

      <FormDivider />

      <SocialAuthButtons onGooglePress={handleGoogleAuth} onApplePress={handleAppleAuth} />

      <Button
        variant="ghost"
        onPress={handleGoToLogin}
        accessibilityLabel="Already have an account? Log in">
        <ThemedText className="text-[16px] text-primary">Already have an account?</ThemedText>
      </Button>
    </AuthLayout>
  );
}
