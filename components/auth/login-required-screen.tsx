import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';

type LoginRequiredScreenProps = {
  title: string;
  subtitle: string;
  illustration: any;
};

export const LoginRequiredScreen: React.FC<LoginRequiredScreenProps> = ({
  title,
  subtitle,
  illustration,
}) => {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1" style={horizontalStyle}>
          <View className="mt-[12px] flex-row items-center">
            <Pressable
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/(tabs)');
                }
              }}
              className="absolute left-0 z-10 h-10 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel={t('common.go_back')}>
              <Ionicons name="chevron-back" size={24} color="#111111" />
            </Pressable>
            <ThemedText className="flex-1 text-center text-[20px] font-semibold text-foreground">
              {title}
            </ThemedText>
          </View>

          <View style={styles.content}>
            <ThemedText style={styles.heading}>{t('auth.login_required')}</ThemedText>
            <ThemedText style={styles.description}>{subtitle}</ThemedText>
            <Image source={illustration} style={styles.illustration} contentFit="contain" />
            <Button onPress={() => router.push('/(auth)')}>
              {t('auth.login_required_button')}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 24,
  },
  illustration: {
    width: 260,
    height: 200,
    marginBottom: 32,
  },
});
