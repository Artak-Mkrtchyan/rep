import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastDescriptor = {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
};

type ToastHostProps = {
  toast: ToastDescriptor | null;
  onDismiss: (id: string) => void;
};

const ICON_FOR: Record<ToastVariant, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle-outline',
  error: 'alert-circle-outline',
  info: 'information-circle-outline',
};

const CARD_BG_FOR: Record<ToastVariant, string> = {
  success: '#E6F9ED', // Light Green
  error: '#FFF0F0', // Light Red
  info: '#EFF6FF', // Light Blue
};

const CARD_BORDER_FOR: Record<ToastVariant, string> = {
  success: '#C2F0D4', // Soft Green Border
  error: '#FED7D7', // Soft Red Border
  info: '#BFDBFE', // Soft Blue Border
};

const ICON_COLOR_FOR: Record<ToastVariant, string> = {
  success: '#087443', // Green
  error: '#FF3636', // Red
  info: '#3B82F6', // Blue
};

/**
 * Imperative toast host. Renders a single toast slot at the top of the screen,
 * animates in/out, auto-dismisses after `duration` (default 3s).
 * Designed to live at the root so it sits above all screens and sheets.
 */
export function ToastHost({ toast, onDismiss }: ToastHostProps) {
  const insets = useSafeAreaInsets();
  const translateY = React.useRef(new Animated.Value(-80)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!toast) return;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -80,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start(() => onDismiss(toast.id));
    }, toast.duration ?? 3000);

    return () => clearTimeout(timer);
  }, [toast, translateY, opacity, onDismiss]);

  if (!toast) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.host, { paddingTop: insets.top + 8, transform: [{ translateY }], opacity }]}>
      <Pressable
        accessibilityRole="alert"
        onPress={() => onDismiss(toast.id)}
        className={cn(
          'mx-4 flex-row items-start gap-3.5 rounded-2xl border px-4 py-3 shadow-lg shadow-neutral-900/5'
        )}
        style={{
          borderColor: CARD_BORDER_FOR[toast.variant],
          backgroundColor: CARD_BG_FOR[toast.variant],
        }}>
        <Ionicons
          name={ICON_FOR[toast.variant]}
          size={22}
          color={ICON_COLOR_FOR[toast.variant]}
          className="mt-0.5"
        />
        <View className="flex-1 gap-0.5">
          <ThemedText className="font-bold text-foreground">
            {toast.message}
          </ThemedText>
          {toast.description ? (
            <ThemedText className="text-[12px] text-neutral-600">
              {toast.description}
            </ThemedText>
          ) : null}
        </View>
        <Ionicons name="close" size={20} color="#9CA3AF" className="mt-0.5" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1000,
  },
});
