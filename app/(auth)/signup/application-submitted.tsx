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
        title="Application has been submitted!"
        imageSource={require('@/assets/images/submitted-illustration.svg')}
        imageWidth={IMAGE_DIMENSIONS.SUBMITTED_ILLUSTRATION.width}
        imageHeight={IMAGE_DIMENSIONS.SUBMITTED_ILLUSTRATION.height}
        description="Your application has been submitted for review. It is currently pending administrator approval. You will be notified once the review is completed."
      />

      <Button onPress={handleContinue} accessibilityLabel="Go to login">
        Ok
      </Button>
    </AuthLayout>
  );
}
