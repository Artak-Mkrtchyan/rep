import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/themed-text';

export default function AnnouncementMapScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { lat, lng, label } = useLocalSearchParams<{
    lat?: string;
    lng?: string;
    label?: string;
  }>();

  const latNum = Number(lat);
  const lngNum = Number(lng);
  const hasCoords = Number.isFinite(latNum) && Number.isFinite(lngNum);

  const mapUrl = hasCoords
    ? `https://yandex.com/map-widget/v1/?ll=${lngNum},${latNum}&z=16&pt=${lngNum},${latNum},pm2rdl`
    : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={router.back}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={styles.backButton}
          hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </Pressable>
        <ThemedText
          numberOfLines={1}
          ellipsizeMode="tail"
          className="flex-1 text-center text-[16px] font-semibold text-foreground">
          {label || t('announcement.detail.view_on_map')}
        </ThemedText>
        <View style={styles.backButton} />
      </View>

      {hasCoords && mapUrl ? (
        <WebView
          source={{ uri: mapUrl }}
          style={styles.webView}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#16A34A" />
            </View>
          )}
        />
      ) : (
        <View style={styles.empty}>
          <ThemedText className="text-[14px] text-muted-foreground">
            {t('announcement.detail.no_coordinates')}
          </ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webView: { flex: 1 },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
