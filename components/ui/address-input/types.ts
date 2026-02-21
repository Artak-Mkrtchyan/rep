import type { TextInputProps } from 'react-native';

import type { AddressSuggestion as LibAddressSuggestion } from '@/lib/yandex-suggest';

export type { YandexSuggestResult } from '@/lib/yandex-suggest';

export type AddressSuggestion = LibAddressSuggestion;

export type AddressInputProps = Omit<TextInputProps, 'value' | 'onChangeText' | 'onFocus'> & {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  onFocus?: (e: any) => void;
  error?: string;
  containerClassName?: string;
  /** Called when user selects a suggestion (address string and optional coords if we add geocode later) */
  onSelectAddress?: (geo: {
    country: string;
    formattedAddress: string;
    house?: string;
    latitude?: number;
    locality: string;
    longitude?: number;
    province: string;
    street: string;
  }) => void;
  /** Yandex Geosuggest API key. Falls back to EXPO_PUBLIC_YANDEX_SUGGEST_API_KEY if not set. */
  apiKey?: string;
  /** Language for suggestions (e.g. en_US, ru_RU). */
  lang?: string;
};
