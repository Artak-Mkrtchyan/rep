import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';

interface AuthLayoutProps {
  children: React.ReactNode;
  centered?: boolean;
  scrollable?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  centered = false,
  scrollable = false,
}) => {
  const { horizontalStyle } = useScreenEdgePadding();

  const content = (
    <View
      className={`w-full flex-1 gap-4${centered ? ' items-center justify-center' : ''}`}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <ThemedView className="flex-1" style={horizontalStyle}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: centered ? 'center' : undefined,
              paddingBottom: 24,
              paddingTop: centered ? 0 : 32,
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
