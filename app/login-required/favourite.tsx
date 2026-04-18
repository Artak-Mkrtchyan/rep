import React from 'react';
import { useTranslation } from 'react-i18next';

import { LoginRequiredScreen } from '@/components/auth/login-required-screen';

export default function FavouriteLoginRequired() {
  const { t } = useTranslation();

  return (
    <LoginRequiredScreen
      title={t('favourite.title')}
      subtitle={t('auth.login_required_favourites')}
      illustration={require('@/assets/images/login-required-favourites.svg')}
    />
  );
}
