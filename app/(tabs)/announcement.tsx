import { Redirect } from 'expo-router';
import React from 'react';

import { useAuth } from '@/context/AuthContext';

/**
 * The Announcement tab doubles as an "Add announcement" action button:
 * authenticated users go to the create-listing flow; guests are sent to the
 * login-required page. The tab bar's `tabPress` listener normally short-
 * circuits before this screen renders, but we also redirect here for deep
 * links and edge cases where `preventDefault` can't run (e.g. programmatic
 * navigation to `/(tabs)/announcement`).
 */
export default function AnnouncementScreen() {
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return null;
  }

  return user ? (
    <Redirect href="/announcement/form/new" />
  ) : (
    <Redirect href="/login-required/announcement" />
  );
}
