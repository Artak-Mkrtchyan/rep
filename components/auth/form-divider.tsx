import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

interface FormDividerProps {
  text?: string;
  className?: string;
}

export const FormDivider: React.FC<FormDividerProps> = ({ text, className }) => {
  const { t } = useTranslation();
  const displayText = text ?? t('common.or');
  return (
    <View className={cn('w-full flex-row items-center justify-center gap-5', className)}>
      <View className="h-px flex-1 bg-border" />
      <ThemedText className="text-[16px] text-muted-foreground">{displayText}</ThemedText>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
};
