import { Image } from 'expo-image';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const canContinue = email.length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ThemedView className="flex-1 items-center justify-center px-4">
        <View className="w-[358px] max-w-full items-center gap-6">
          <Image
            source={require('@/assets/images/login-illustration.svg')}
            style={{ width: 208, height: 141 }}
            contentFit="contain"
          />

          <ThemedText type="title" className="text-center text-[#111111]">
            Log in
          </ThemedText>

          <View className="w-full gap-1">
            <ThemedText className="text-[12px] font-bold leading-[11px] text-[#111111]">
              Email
            </ThemedText>
            <View className="h-12 justify-center rounded-[12px] border border-[#E2E2E2] bg-white px-3">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder=""
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="text-base text-[#111111]"
                placeholderTextColor="#ABABAB"
              />
            </View>
          </View>

          <View className="w-full gap-1">
            <ThemedText className="text-[12px] font-bold leading-[11px] text-[#111111]">
              Password
            </ThemedText>
            <View className="h-12 justify-center rounded-[12px] border border-[#E2E2E2] bg-white px-3">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder=""
                secureTextEntry
                className="text-base text-[#111111]"
                placeholderTextColor="#ABABAB"
              />
            </View>

            <Pressable
              className="mt-2 h-8 justify-center self-end rounded-[6px] px-1 py-2"
              onPress={() => {}}>
              <ThemedText className="text-[16px] text-[#13B86D]">Forgot password?</ThemedText>
            </Pressable>
          </View>

          <Pressable
            disabled={!canContinue}
            onPress={() => {}}
            className={`mt-3 h-[50px] w-full items-center justify-center rounded-[12px] ${canContinue ? 'bg-[#0E9457]' : 'bg-[#E2E2E2]'}`}
            style={({ pressed }) => (pressed && canContinue ? { opacity: 0.9 } : undefined)}>
            <ThemedText className="text-[16px] font-medium text-white">Continue</ThemedText>
          </Pressable>

          <View className="w-full flex-row items-center justify-center gap-5">
            <View className="h-px flex-1 bg-[#ABABAB]" />
            <ThemedText className="text-[16px] text-[#ABABAB]">OR</ThemedText>
            <View className="h-px flex-1 bg-[#ABABAB]" />
          </View>

          <View className="w-full flex-row gap-4">
            <Pressable
              className="h-12 flex-1 justify-center rounded-[12px] border border-[#F1F1F1] bg-white px-4"
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
              className="h-12 flex-1 justify-center rounded-[12px] border border-[#F1F1F1] bg-white px-4"
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

// Converted styles to Nativewind className usage above
