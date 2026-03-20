import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const COLLAPSED_LINES = 4;

type DescriptionSectionProps = {
  description: string;
};

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({ description }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);

  if (!description) return null;

  return (
    <View className="gap-[16px] px-[16px]">
      <ThemedText className="text-[20px] font-bold leading-[24px] text-foreground">
        {t('announcement.detail.description')}
      </ThemedText>
      <ThemedText
        className="text-[14px] leading-[20px] text-muted-foreground"
        numberOfLines={expanded ? undefined : COLLAPSED_LINES}>
        {description}
      </ThemedText>
      <Pressable onPress={toggleExpanded}>
        <ThemedText className="text-[14px] font-semibold text-primary">
          {expanded ? t('announcement.detail.show_less') : t('announcement.detail.show_more')}
        </ThemedText>
      </Pressable>
    </View>
  );
};
