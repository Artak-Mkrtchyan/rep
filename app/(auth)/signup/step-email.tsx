import { router } from 'expo-router';
import React from 'react';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormDivider } from '@/components/auth/form-divider';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useTheme } from '@/hooks/use-theme';

export default function SignUpEmailStepScreen() {
  const [email, setEmail] = React.useState('');
  const { tokens: theme } = useTheme();

  const canContinue = email.length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    router.push(AUTH_ROUTES.SIGNUP_VERIFY);
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
    <AuthLayout centered>
      <AuthHeader
        title="Sign up"
        imageSource={require('@/assets/images/icon-signup-email.svg')}
        imageWidth={IMAGE_DIMENSIONS.SIGNUP_EMAIL.width}
        imageHeight={IMAGE_DIMENSIONS.SIGNUP_EMAIL.height}
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
