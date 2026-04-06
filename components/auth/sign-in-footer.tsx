import React from 'react';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';

import { FormDivider } from './form-divider';
import { SocialAuthButtons } from './social-auth-buttons';

interface SignInFooterProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onSignInPress?: () => void;
  showSignInLink?: boolean;
  signInLabel?: string;
  signInActionLabel?: string;
}

export const SignInFooter: React.FC<SignInFooterProps> = ({
  onGooglePress,
  onApplePress,
  onSignInPress,
  showSignInLink = false,
  signInLabel,
  signInActionLabel,
}) => {
  const { t } = useTranslation();
  const resolvedSignInLabel = signInLabel ?? t('auth.already_have_account');
  const resolvedSignInActionLabel = signInActionLabel ?? t('auth.sign_in');
  return (
    <>
      <FormDivider className="mb-6" />

      <SocialAuthButtons onGooglePress={onGooglePress} onApplePress={onApplePress} />

      {showSignInLink && onSignInPress ? (
        <Button
          variant="ghost"
          onPress={onSignInPress}
          accessibilityLabel={`${resolvedSignInLabel} ${resolvedSignInActionLabel}`}>
          <ThemedText className="text-[18px] font-[400] leading-[24px] text-[#ABABAB]">
            {resolvedSignInLabel}{' '}
            <ThemedText className="text-[18px] font-[500] leading-[24px] text-primary">
              {resolvedSignInActionLabel}
            </ThemedText>
          </ThemedText>
        </Button>
      ) : null}
    </>
  );
};
