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
        title={t('signup.application_submitted.title')}
        imageSource={require('@/assets/images/submitted-illustration.svg')}
        imageWidth={IMAGE_DIMENSIONS.SUBMITTED_ILLUSTRATION.width}
        imageHeight={IMAGE_DIMENSIONS.SUBMITTED_ILLUSTRATION.height}
        description={t('signup.application_submitted.description')}
      />

      <Button onPress={handleContinue} accessibilityLabel={t('signup.application_submitted.ok')}>
        {t('signup.application_submitted.ok')}
      </Button>
    </AuthLayout>
  );
}
