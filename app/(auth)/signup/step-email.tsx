import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';

export default function SignUpEmailStepScreen() {
  const [email, setEmail] = React.useState('');
  const { tokens: theme } = useTheme();

  const canContinue = email.length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    router.push('/(auth)/signup/verify');
  };

  const handleGoToLogin = () => {
    router.replace('/(auth)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ThemedView className="flex-1 items-center justify-center px-4">
        <View className="w-[358px] max-w-full items-center gap-6">
          <Image
            style={{ width: 196, height: 138 }}
            source={require('@/assets/images/icon-signup-email.svg')}
            contentFit="contain"
          />

          <ThemedText type="title" className="text-center">
            Sign up
          </ThemedText>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={theme.placeholder}
          />

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
              style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              onPress={() => {}}>
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
              style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              onPress={() => {}}>
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

          <Pressable
            onPress={handleGoToLogin}
            accessibilityRole="button"
            accessibilityLabel="Already have an account? Log in"
            className="h-12 w-full items-center justify-center rounded-[12px]">
            <ThemedText className="text-[16px] text-primary">Already have an account?</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
