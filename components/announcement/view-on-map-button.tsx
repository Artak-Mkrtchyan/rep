import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type ViewOnMapButtonProps = {
  lat?: number | null;
  lng?: number | null;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export const ViewOnMapButton: React.FC<ViewOnMapButtonProps> = ({ lat, lng, label, style }) => {
  const router = useRouter();
  const { t } = useTranslation();

  if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const handlePress = () => {
    const query = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      label: label ?? '',
    }).toString();
    router.push(`/announcement/map?${query}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={t('announcement.detail.view_on_map')}
      style={[styles.button, style]}>
      <ThemedText className="text-[16px] font-medium leading-[21px] text-primary">
        {t('announcement.detail.view_on_map')}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 49,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
});
