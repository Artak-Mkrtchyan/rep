import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';

interface FormDividerProps {
  text?: string;
}

export const FormDivider: React.FC<FormDividerProps> = ({ text }) => {
  const { t } = useTranslation();
  const displayText = text ?? t('common.or');
  return (
    <View className="w-full flex-row items-center justify-center gap-5">
      <View className="h-px flex-1 bg-border" />
      <ThemedText className="text-[16px] text-muted-foreground">{displayText}</ThemedText>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
};
