import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

export const SUPPORTED_LANGUAGES = ['en', 'ru', 'uz'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
const defaultLanguage: Language = SUPPORTED_LANGUAGES.includes(deviceLanguage as Language)
  ? (deviceLanguage as Language)
  : 'en';

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    uz: { translation: uz },
  },
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
