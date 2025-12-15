import { router } from 'expo-router';
import React from 'react';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';

export default function SignUpCompletedScreen() {
  const handleContinue = () => {
    router.replace(AUTH_ROUTES.LOGIN);
  };

  return (
    <AuthLayout centered>
      <AuthHeader
        title=""
        imageSource={require('@/assets/images/icon-signup-success.svg')}
        imageWidth={IMAGE_DIMENSIONS.SIGNUP_SUCCESS.width}
        imageHeight={IMAGE_DIMENSIONS.SIGNUP_SUCCESS.height}
        description="You've successfully registered. Welcome aboard!"
      />

      <Button onPress={handleContinue} accessibilityLabel="Go to login">
        Continue
      </Button>
    </AuthLayout>
  );
}
