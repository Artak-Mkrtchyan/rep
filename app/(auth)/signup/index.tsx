import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Select } from '@/components/ui/select';

type Role = '' | 'individual' | 'company' | 'broker';

export default function SignUpFirstScreen() {
  const [role, setRole] = React.useState<Role>('');

  const canContinue = !!role;

  const handleContinue = () => {
    if (!canContinue) return;
    router.push('/(auth)/signup/step-email');
  };

  const Radio = ({ value, label }: { value: Role; label: string }) => {
    const selected = role === value;
    return (
      <Pressable
        onPress={() => setRole(value)}
        accessibilityRole="radio"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        className="flex-row items-center gap-2 rounded-[12px]">
        <View
          className={`h-5 w-5 items-center justify-center rounded-full border ${
            selected ? 'border-primary' : 'border-default'
          }`}>
          <View
            className={`h-2.5 w-2.5 rounded-full ${selected ? 'bg-primary' : 'bg-transparent'}`}
          />
        </View>
        <ThemedText className="text-[14px]">{label}</ThemedText>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ThemedView className="flex-1 items-center justify-center px-4">
        <View className="w-[358px] max-w-full items-center gap-6">
          <Image
            style={{ width: 170, height: 113 }}
            source={require('@/assets/images/signup-illustration.svg')}
            contentFit="contain"
          />

          <ThemedText type="title" className="text-center">
            Sign up
          </ThemedText>

          <View className="w-full gap-4">
            <ThemedText className="text-[14px] text-muted-foreground">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry&rsquo;s standard dummy text ever since the 1500s, when an
              unknown printer took.
            </ThemedText>

            <View className="gap-3">
              <Select
                label="Account type"
                placeholder="Select"
                value={role}
                onChange={(v) => setRole(v as Role)}
                options={[
                  { label: 'Individual user', value: 'individual' },
                  { label: 'Construction company', value: 'company' },
                  { label: 'Broker', value: 'broker' },
                ]}
              />

              {role === 'broker' ? (
                <View className="flex-row items-center justify-between">
                  <Radio value="individual" label="Individual" />
                  <Radio value="broker" label="Broker" />
                </View>
              ) : null}
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
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
