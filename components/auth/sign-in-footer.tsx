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
}

export const SignInFooter: React.FC<SignInFooterProps> = ({
  onGooglePress,
  onApplePress,
  onSignInPress,
  showSignInLink = false,
}) => {
  return (
    <>
      <FormDivider />

      <SocialAuthButtons onGooglePress={onGooglePress} onApplePress={onApplePress} />

      {showSignInLink && onSignInPress ? (
        <Button
          variant="ghost"
          onPress={onSignInPress}
          accessibilityLabel="Already have an account? Log in">
          <ThemedText className="text-[18px] font-[400] leading-[24px] text-[#ABABAB]">
            Already have an account?{' '}
            <ThemedText className="text-[18px] font-[500] leading-[24px] text-primary">
              Sign in
            </ThemedText>
          </ThemedText>
        </Button>
      ) : null}
    </>
  );
};
