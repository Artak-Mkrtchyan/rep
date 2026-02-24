import React from 'react';

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
  signInLabel = 'Already have an account?',
  signInActionLabel = 'Sign in',
}) => {
  return (
    <>
      <FormDivider />

      <SocialAuthButtons onGooglePress={onGooglePress} onApplePress={onApplePress} />

      {showSignInLink && onSignInPress ? (
        <Button
          variant="ghost"
          onPress={onSignInPress}
          accessibilityLabel={`${signInLabel} ${signInActionLabel}`}>
          <ThemedText className="text-[18px] font-[400] leading-[24px] text-[#ABABAB]">
            {signInLabel}{' '}
            <ThemedText className="text-[18px] font-[500] leading-[24px] text-primary">
              {signInActionLabel}
            </ThemedText>
          </ThemedText>
        </Button>
      ) : null}
    </>
  );
};
