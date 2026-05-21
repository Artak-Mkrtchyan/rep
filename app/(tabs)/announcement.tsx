import { Redirect } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { LoginRequiredScreen } from '@/components/auth/login-required-screen';
import { useAuth } from '@/context/AuthContext';

/**
 * The Announcement tab doubles as an "Add announcement" action button:
 * - Signed-in users: the tab-bar listener pushes them into the create-listing
 *   flow (outside the tabs stack). This screen only renders on deep links /
 *   programmatic navigation, where we redirect them to the form.
 * - Guests: we render the login-required screen INSIDE the tabs stack so the
 *   bottom navigation bar stays visible (bug fix: tab bar was hidden when the
 *   login-required page lived at /login-required/announcement outside tabs).
 */
export default function AnnouncementScreen() {
  const { t } = useTranslation();
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return null;
  }

  if (user) {
    return <Redirect href="/announcement/form/new" />;
  }

  return (
    <LoginRequiredScreen
      title={t('announcement.add')}
      subtitle={t('auth.login_required_announcement')}
      illustration={require('@/assets/images/login-required-announcement.svg')}
    />
  );
}
