import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormDivider } from '@/components/auth/form-divider';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { AUTH_ROUTES, IMAGE_DIMENSIONS, YEARS_OF_ACTIVITY_OPTIONS } from '@/constants/auth';

import type { BrokerSignUpForm } from '@/types/auth';

const FILE_UPLOAD_HEIGHT = 142;

export default function BrokerSignUpScreen() {
  const [formData, setFormData] = React.useState<BrokerSignUpForm>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    yearsOfActivity: '',
    filesCount: 0,
  });

  const canContinue =
    formData.fullName.trim().length > 0 &&
    formData.companyName.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.phone.trim().length > 0 &&
    formData.yearsOfActivity !== '' &&
    formData.filesCount > 0;

  const updateFormField = <K extends keyof BrokerSignUpForm>(
    field: K,
    value: BrokerSignUpForm[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!canContinue) return;
    router.push(AUTH_ROUTES.SIGNUP_PASSWORD);
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload functionality
    updateFormField('filesCount', formData.filesCount + 1);
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google authentication
  };

  const handleAppleAuth = () => {
    // TODO: Implement Apple authentication
  };

  return (
    <AuthLayout scrollable>
      <AuthHeader
        title="Sign up"
        imageSource={require('@/assets/images/icon-broker-illustration.svg')}
        imageWidth={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.width}
        imageHeight={IMAGE_DIMENSIONS.BROKER_ILLUSTRATION.height}
      />

      <View className="w-full gap-4">
        <Input
          label="Full name"
          value={formData.fullName}
          onChangeText={(value) => updateFormField('fullName', value)}
          placeholder=""
        />

        <Input
          label="Company name"
          value={formData.companyName}
          onChangeText={(value) => updateFormField('companyName', value)}
          placeholder=""
        />

        <Input
          label="Company email"
          value={formData.email}
          onChangeText={(value) => updateFormField('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder=""
        />

        <Input
          label="Phone number"
          value={formData.phone}
          onChangeText={(value) => updateFormField('phone', value)}
          keyboardType="phone-pad"
          placeholder=""
        />

        <View className="gap-2">
          <View className="flex-row items-center">
            <ThemedText className="text-[12px] font-bold leading-[11px] text-foreground">
              Years of activity
            </ThemedText>
            <Text className="ml-1 text-[12px] leading-[11px] text-primary">*</Text>
          </View>
          <Select
            placeholder="Select a range"
            value={formData.yearsOfActivity}
            onChange={(value) =>
              updateFormField('yearsOfActivity', value as BrokerSignUpForm['yearsOfActivity'])
            }
            options={YEARS_OF_ACTIVITY_OPTIONS}
          />
        </View>

        <View className="mt-2 gap-2">
          <View className="flex-row items-center">
            <ThemedText className="text-[12px] font-bold leading-[11px] text-foreground">
              Files upload
            </ThemedText>
            <Text className="ml-1 text-[12px] leading-[11px] text-primary">*</Text>
          </View>
          <ThemedText className="text-[12px] text-muted-foreground">
            Please attach your brokerage license or proof of authorization
          </ThemedText>

          <View
            className="w-full items-center justify-center rounded-[12px] border border-default bg-card"
            style={{ height: FILE_UPLOAD_HEIGHT }}>
            <View className="items-center">
              <View className="mb-3 h-11 w-11 items-center justify-center rounded-full border border-default">
                <Text className="text-[18px] text-muted-foreground">+</Text>
              </View>
              <ThemedText className="text-[12px] text-muted-foreground">
                Upload your photo
              </ThemedText>
            </View>
          </View>

          <View className="items-center">
            <Pressable
              onPress={handleFileUpload}
              className="mt-3 h-9 items-center justify-center rounded-[10px] border border-default bg-card px-5"
              accessibilityRole="button"
              accessibilityLabel="Upload file">
              <ThemedText className="text-[14px]">Choose file</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>

      <Button disabled={!canContinue} onPress={handleContinue} accessibilityLabel="Continue">
        Continue
      </Button>

      <FormDivider />

      <SocialAuthButtons onGooglePress={handleGoogleAuth} onApplePress={handleAppleAuth} />
    </AuthLayout>
  );
}
