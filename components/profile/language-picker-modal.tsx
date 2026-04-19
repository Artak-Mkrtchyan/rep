import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import type { Language } from '@/lib/i18n/i18n';
import { useThemeValue } from '@/hooks/use-theme';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
];

type LanguagePickerModalProps = {
  visible: boolean;
  currentLanguage: Language;
  onSelect: (language: Language) => void;
  onClose: () => void;
};

export const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  visible,
  currentLanguage,
  onSelect,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeValue('primary');
  const { t } = useTranslation();

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent>
      <Pressable style={{ flex: 1 }} onPress={onClose} accessible={false}>
        <View className="flex-1 justify-end bg-black/40">
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className="rounded-t-2xl bg-card px-5 pb-4 pt-5"
              style={{ paddingBottom: insets.bottom + 16 }}>
              <View className="mb-4 flex-row items-center justify-between">
                <ThemedText className="text-lg font-semibold text-foreground">
                  {t('language_picker.title')}
                </ThemedText>
                <Pressable
                  onPress={onClose}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={t('common.close')}>
                  <Ionicons name="close" size={24} color="#999" />
                </Pressable>
              </View>

              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <Pressable
                    key={lang.code}
                    onPress={() => onSelect(lang.code)}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: isSelected }}
                    className="flex-row items-center rounded-xl px-3 py-3"
                    style={isSelected ? { backgroundColor: `${primaryColor}15` } : undefined}>
                    <ThemedText className="mr-3 text-[22px]">{lang.flag}</ThemedText>
                    <ThemedText
                      className="flex-1 text-[16px] text-foreground"
                      style={isSelected ? { color: primaryColor, fontWeight: '600' } : undefined}>
                      {lang.label}
                    </ThemedText>
                    {isSelected && <Ionicons name="checkmark" size={20} color={primaryColor} />}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  en: '🇺🇸',
  ru: '🇷🇺',
  uz: '🇺🇿',
};
