import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import type { SortOption } from '@/types/search';

const SORT_OPTIONS: { value: SortOption; labelKey: string }[] = [
  { value: 'NEWEST_FIRST', labelKey: 'search.sort.newest_first' },
  { value: 'PRICE_LOW_TO_HIGH', labelKey: 'search.sort.price_low_to_high' },
  { value: 'PRICE_HIGH_TO_LOW', labelKey: 'search.sort.price_high_to_low' },
  { value: 'AREA_SMALL_TO_LARGE', labelKey: 'search.sort.area_small_to_large' },
  { value: 'AREA_LARGE_TO_SMALL', labelKey: 'search.sort.area_large_to_small' },
];

type SortOrderModalProps = {
  visible: boolean;
  value: SortOption;
  onSelect: (option: SortOption) => void;
  onClose: () => void;
};

export const SortOrderModal: React.FC<SortOrderModalProps> = ({
  visible,
  value,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleSelect = useCallback(
    (option: SortOption) => {
      onSelect(option);
      onClose();
    },
    [onSelect, onClose],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <Pressable
            onPress={onClose}
            className="h-10 w-10 items-center justify-center"
            accessibilityLabel={t('common.close')}
            accessibilityRole="button">
            <Ionicons name="close" size={24} color="#111111" />
          </Pressable>
          <ThemedText className="text-[18px] font-semibold">
            {t('search.sort.title')}
          </ThemedText>
          <View className="h-10 w-10" />
        </View>

        <View className="mt-2">
          {SORT_OPTIONS.map((option) => {
            const isActive = value === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => handleSelect(option.value)}
                className="border-b border-default px-4 py-4"
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}>
                <ThemedText
                  className={`text-[16px] ${isActive ? 'font-semibold text-primary' : 'text-foreground'}`}>
                  {t(option.labelKey)}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

export { SORT_OPTIONS };
