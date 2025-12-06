import { Image } from 'expo-image';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const canContinue = email.length > 0 && password.length > 0;
  const { tokens: theme } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ThemedView className="flex-1 items-center justify-center px-4">
        <View className="w-[358px] max-w-full items-center gap-6">
          <Image
            style={{ width: 208, height: 141 }}
            source={require('@/assets/images/login-illustration.svg')}
            contentFit="contain"
          />

          <ThemedText type="title" className="text-center">
            Log in
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

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder=""
            secureTextEntry
            placeholderTextColor={theme.placeholder}
          />

          <Pressable
            className="h-16 justify-center self-end rounded-[6px] px-1 py-2"
            onPress={() => {}}>
            <ThemedText className="text-[16px] text-primary">Forgot password?</ThemedText>
          </Pressable>

          <Pressable
            disabled={!canContinue}
            onPress={() => {}}
            className={`mt-3 h-[50px] w-full items-center justify-center rounded-[12px] ${
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
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
