import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Language, SUPPORTED_LANGUAGES } from '@/lib/i18n/i18n';

const LANGUAGE_STORAGE_KEY = 'app-language';

export function useLanguage() {
  const { i18n, t } = useTranslation();

  const changeLanguage = useCallback(
    async (language: Language) => {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    },
    [i18n]
  );

  return {
    t,
    language: i18n.language as Language,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}

export async function loadSavedLanguage(): Promise<Language | null> {
  const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
    return saved as Language;
  }
  return null;
}
