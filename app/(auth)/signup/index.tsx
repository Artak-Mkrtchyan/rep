import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { RadioButton } from '@/components/auth/radio-button';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ACCOUNT_TYPE_OPTIONS, AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';

import type { AccountRole } from '@/types/auth';

export default function SignUpFirstScreen() {
  const [role, setRole] = React.useState<AccountRole>('');

  const canContinue = Boolean(role);

  const handleContinue = () => {
    if (!canContinue) return;
    router.push(AUTH_ROUTES.SIGNUP_EMAIL);
  };

  return (
    <AuthLayout centered>
      <AuthHeader
        title="Sign up"
        imageSource={require('@/assets/images/signup-illustration.svg')}
        imageWidth={IMAGE_DIMENSIONS.SIGNUP_ILLUSTRATION.width}
        imageHeight={IMAGE_DIMENSIONS.SIGNUP_ILLUSTRATION.height}
      />

      <View className="w-full gap-4">
        <ThemedText className="text-[14px] text-muted-foreground">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry&rsquo;s standard dummy text ever since the 1500s, when an unknown
          printer took.
        </ThemedText>

        <View className="gap-3">
          <Select
            label="Account type"
            placeholder="Select"
            value={role}
            onChange={(value) => setRole(value as AccountRole)}
            options={ACCOUNT_TYPE_OPTIONS}
          />

          {role === 'broker' && (
            <View className="flex-row items-center justify-between">
              <RadioButton
                value="individual"
                label="Individual"
                selectedValue={role}
                onSelect={(value) => setRole(value as AccountRole)}
              />
              <RadioButton
                value="broker"
                label="Broker"
                selectedValue={role}
                onSelect={(value) => setRole(value as AccountRole)}
              />
            </View>
          )}
        </View>
      </View>

      <Button disabled={!canContinue} onPress={handleContinue} accessibilityLabel="Continue">
        Continue
      </Button>
    </AuthLayout>
  );
}
