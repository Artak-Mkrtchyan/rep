import { useAsyncMutation } from '@/hooks/use-async-mutation';
import { YandexGeocodeResponse, yandexService, YandexSuggestResponse } from '@/lib/api/yandex';

export interface ValidationError {
  fieldName: string;
  errorMessage: string;
  errorCode: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  validationErrors?: ValidationError[];
}

interface SearchAddressParams {
  text: string;
  lang?: string;
  results?: number;
}

interface GeocodeByUriParams {
  uri: string;
  format?: string;
}

interface MultiLangGeocodeResponse {
  ru: YandexGeocodeResponse | undefined;
  en: YandexGeocodeResponse | undefined;
  uz: YandexGeocodeResponse | undefined;
}

export const useSearchAddress = () => {
  return useAsyncMutation<YandexSuggestResponse, ApiError, SearchAddressParams>(
    ({ text, lang, results }: SearchAddressParams) =>
      yandexService.searchAddress(text, { lang, results }),
    (error: ApiError) => {
      console.error('Address search error:', error);
    }
  );
};

export const useGeocodeByUri = () => {
  return useAsyncMutation<MultiLangGeocodeResponse, ApiError, GeocodeByUriParams>(
    async ({ uri, format }: GeocodeByUriParams) => {
      const languages = ['ru', 'en', 'uz'] as const;

      const promises = languages.map((lang) =>
        yandexService.geocodeByUri(uri, { lang, format }).catch(() => undefined)
      );

      const [ruResponse, enResponse, uzResponse] = await Promise.all(promises);

      return {
        ru: ruResponse,
        en: enResponse,
        uz: uzResponse,
      };
    },
    (error: ApiError) => {
      console.error('Geocode by URI error:', error);
    }
  );
};
