import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function BrokerSignUpScreen() {
  const [fullName, setFullName] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [years, setYears] = React.useState<'' | '0-1' | '2-5' | '6-10' | '10+'>('');
  const [filesCount, setFilesCount] = React.useState(0);

  const canContinue =
    fullName.trim().length > 0 &&
    companyName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    years !== '' &&
    filesCount >= 0;

  const handleContinue = () => {
    if (!canContinue) return;
    router.push('/(auth)/signup/create-password');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ThemedView className="flex-1 px-4">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}>
          <View className="w-[358px] max-w-full items-center gap-6 pt-8">
            <View className="items-center gap-4">
              <Image
                style={{ width: 196, height: 138 }}
                source={require('@/assets/images/icon-broker-illustration.svg')}
                contentFit="contain"
              />
              <ThemedText type="title" className="text-center">
                Sign up
              </ThemedText>
            </View>

            <View className="w-full gap-4">
              <Input label="Full name" value={fullName} onChangeText={setFullName} placeholder="" />
              <Input
                label="Company name"
                value={companyName}
                onChangeText={setCompanyName}
                placeholder=""
              />
              <Input
                label="Company email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder=""
              />
              <Input
                label="Phone number"
                value={phone}
                onChangeText={setPhone}
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
                  value={years}
                  onChange={(v) => setYears(v as any)}
                  options={[
                    { label: '0-1 years', value: '0-1' },
                    { label: '2-5 years', value: '2-5' },
                    { label: '6-10 years', value: '6-10' },
                    { label: '10+ years', value: '10+' },
                  ]}
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
                <View className="border-default h-[142px] w-full items-center justify-center rounded-[12px] border bg-card">
                  <View className="items-center">
                    <View className="border-default mb-3 h-11 w-11 items-center justify-center rounded-full border">
                      <Text className="text-[18px] text-muted-foreground">+</Text>
                    </View>
                    <ThemedText className="text-[12px] text-muted-foreground">
                      Upload your photo
                    </ThemedText>
                  </View>
                </View>
                <View className="items-center">
                  <Pressable
                    onPress={() => setFilesCount((n) => n + 1)}
                    className="border-default mt-3 h-9 items-center justify-center rounded-[10px] border bg-card px-5"
                    accessibilityRole="button"
                    accessibilityLabel="Upload file">
                    <ThemedText className="text-[14px]">Choose file</ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>

            <Pressable
              disabled={!canContinue}
              onPress={handleContinue}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              className={`h-[50px] w-full items-center justify-center rounded-[12px] ${
                canContinue ? 'bg-primary' : 'bg-input'
              }`}
              style={({ pressed }) => (pressed && canContinue ? { opacity: 0.9 } : undefined)}>
              <ThemedText className="text-[16px] font-medium text-white">Continue</ThemedText>
            </Pressable>

            <View className="w-full flex-row items-center justify-center gap-5">
              <View className="h-px flex-1 bg-border" />
              <ThemedText className="text-[16px] text-muted-foreground">OR</ThemedText>
              <View className="h-px flex-1 bg-border" />
            </View>

            <View className="w-full flex-row gap-4">
              <Pressable
                className="h-12 flex-1 justify-center rounded-[12px] border border-secondary bg-card px-4"
                accessibilityRole="button"
                accessibilityLabel="Continue with Google">
                <View className="flex-row items-center justify-center gap-2">
                  <Image
                    source={require('@/assets/images/google-icon.svg')}
                    style={{ width: 24, height: 24 }}
                    contentFit="contain"
                  />
                  <ThemedText>Google</ThemedText>
                </View>
              </Pressable>
              <Pressable
                className="h-12 flex-1 justify-center rounded-[12px] border border-secondary bg-card px-4"
                accessibilityRole="button"
                accessibilityLabel="Continue with Apple">
                <View className="flex-row items-center justify-center gap-2">
                  <Image
                    source={require('@/assets/images/apple-icon.svg')}
                    style={{ width: 24, height: 24 }}
                    contentFit="contain"
                  />
                  <ThemedText>Apple</ThemedText>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
