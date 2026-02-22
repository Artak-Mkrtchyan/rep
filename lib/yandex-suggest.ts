import { YANDEX_SUGGEST_API_KEY } from '@/constants/env';

const YANDEX_SUGGEST_BASE = 'https://suggest-maps.yandex.ru/v1/suggest';

const TYPES = ['country', 'province', 'locality', 'street', 'house'];
export const YANDEX_SUGGEST_MAX_RESULTS = 6;

export type YandexSuggestResult = {
  title: { text: string };
  subtitle?: { text: string };
  address?: {
    formatted_address: string;
    component?: {
      name: string;
      kind: ['COUNTRY'] | ['PROVINCE'] | ['LOCALITY'] | ['STREET'] | ['HOUSE'];
    }[];
  };
  uri?: string;
};

export type AddressSuggestion = {
  id: string;
  title: string;
  subtitle?: string;
  formattedAddress: string;
  uri?: string;
  country: string;
  house?: string;
  locality: string;
  province: string;
  street: string;
  latitude?: number;
  longitude?: number;
};

const componentByKind = (
  components: NonNullable<YandexSuggestResult['address']>['component']
): Record<string, string> => {
  const byKind: Record<string, string> = {};
  if (!components) return byKind;
  for (const c of components) {
    const k = c.kind?.[0];
    if (k && c.name) byKind[k] = c.name;
  }
  return byKind;
};

export const fetchYandexSuggestions = async (
  query: string,
  lang: string
): Promise<AddressSuggestion[]> => {
  if (!query.trim()) return [];
  const url = `${YANDEX_SUGGEST_BASE}?apikey=${encodeURIComponent(YANDEX_SUGGEST_API_KEY || '')}&text=${encodeURIComponent(query.trim())}&print_address=1&lang=${lang}&results=${YANDEX_SUGGEST_MAX_RESULTS}&types=${TYPES.join(',')}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = (await res.json()) as { results?: YandexSuggestResult[] };
  const results = data.results ?? [];

  return results.map((r, i) => {
    const parts = componentByKind(r.address?.component);
    return {
      id: `${i}-${r.title?.text ?? ''}`,
      title: r.title?.text ?? '',
      subtitle: r.subtitle?.text,
      formattedAddress: r.address?.formatted_address ?? r.title?.text ?? '',
      uri: r.uri,
      country: parts['COUNTRY'] ?? '',
      house: parts['HOUSE'] ?? '',
      locality: parts['LOCALITY'] ?? '',
      province: parts['PROVINCE'] ?? '',
      street: parts['STREET'] ?? '',
    };
  });
};
