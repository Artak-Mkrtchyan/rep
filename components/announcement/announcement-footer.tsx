import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';

const FOOTER_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: -2 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

export type AnnouncementFooterProps = {
  firstButtonLabel?: string;
  secondButtonLabel?: string;
  onNextPress: () => void;
  onSaveAndExitPress: () => void;
};

export const AnnouncementFooter: React.FC<AnnouncementFooterProps> = ({
  onNextPress,
  onSaveAndExitPress,
  firstButtonLabel = '',
  secondButtonLabel = '',
}) => {
  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom > 0 ? insets.bottom + 21 : 24;

  return (
    <View
      className="rounded-t-[12px] bg-white px-[16px] pt-[24px]"
      style={{
        paddingBottom,
        borderTopWidth: 1,
        borderTopColor: '#F1F1F1',
        ...FOOTER_SHADOW,
      }}>
      <Button onPress={onNextPress} accessibilityLabel="Next">
        {firstButtonLabel}
      </Button>
      <Button
        variant="secondary"
        onPress={onSaveAndExitPress}
        accessibilityLabel="Save and exit"
        style={{ backgroundColor: '#F1F1F1', borderWidth: 0, marginTop: 12 }}>
        <ThemedText className="text-[16px] font-medium text-primary">
          {secondButtonLabel}
        </ThemedText>
      </Button>
    </View>
  );
};
