import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';

export default function SignUpCompletedScreen() {
  const { t } = useTranslation();
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
        description={t('signup.completed.description')}
      />

      <Button onPress={handleContinue} accessibilityLabel={t('signup.completed.go_to_home')}>
        {t('signup.completed.go_to_home')}
      </Button>
    </AuthLayout>
  );
}
