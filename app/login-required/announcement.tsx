import React from 'react';
import { useTranslation } from 'react-i18next';

import { LoginRequiredScreen } from '@/components/auth/login-required-screen';

export default function AnnouncementLoginRequired() {
  const { t } = useTranslation();

  return (
    <LoginRequiredScreen
      title={t('announcement.add')}
      subtitle={t('auth.login_required_announcement')}
      illustration={require('@/assets/images/login-required-announcement.svg')}
    />
  );
}
