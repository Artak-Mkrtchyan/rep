import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

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
    <View className={`w-[${CONTAINER_WIDTH}px] max-w-full items-center gap-4`}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ThemedView className={`flex-1 px-4 ${centered ? 'items-center justify-center' : ''}`}>
        {scrollable ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              alignItems: 'center',
              paddingBottom: 24,
              paddingTop: centered ? 0 : 32,
            }}
            showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        ) : centered ? (
          content
        ) : (
          <View className="w-[358px] max-w-full items-center gap-4 pt-10">{content}</View>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
};
