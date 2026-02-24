import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';

interface AuthLayoutProps {
  children: React.ReactNode;
  centered?: boolean;
  scrollable?: boolean;
}

const CONTAINER_WIDTH = 358;

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  centered = false,
  scrollable = false,
}) => {
  const content = (
    <View
      className={`w-[${CONTAINER_WIDTH}px] max-w-full flex-1 items-center gap-4${centered ? ' justify-center' : ''}`}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <ThemedView className="flex-1 px-4">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: centered ? 'center' : undefined,
              paddingBottom: 24,
              paddingTop: centered || scrollable ? 0 : 32,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {content}
          </ScrollView>
        </ThemedView>
      </Pressable>
    </KeyboardAvoidingView>
  );
};
