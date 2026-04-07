import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type ClosingReasonBannerProps = {
  reason: string;
};

export const ClosingReasonBanner: React.FC<ClosingReasonBannerProps> = ({ reason }) => {
  const { t } = useTranslation();

  return (
    <View className="mx-4 flex-row items-center gap-2 rounded-[8px] bg-[#FFF0F0] px-3 py-2.5">
      <Ionicons name="alert-circle-outline" size={18} color="#E53935" />
      <ThemedText className="flex-1 text-[13px] font-medium leading-[18px] text-[#E53935]">
        {t('announcement.my.closing_reason')}: {reason}
      </ThemedText>
    </View>
  );
};
