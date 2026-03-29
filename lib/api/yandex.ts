export interface YandexSuggestRequest {
  text: string;
  lang?: string;
  results?: number;
}

export interface YandexSuggestResponse {
  suggest_reqid: string;
  results: YandexSuggestRequestResults[];
}
export interface YandexSuggestRequestResults {
  title: {
    text: string;
  };
  subtitle?: {
    text: string;
  };
  tags?: string[];
  distance?: {
    value: number;
    text: string;
  };
  uri?: string;
}

export enum YandexSuggestTypes {
  biz = 'biz',
  geo = 'geo',
  street = 'street',
  metro = 'metro',
  district = 'district',
  locality = 'locality',
  area = 'area',
  province = 'province',
  country = 'country',
  house = 'house',
  entrance = 'entrance',
}
export interface YandexGeocodeResponse {
  response: {
    GeoObjectCollection: {
      metaDataProperty: {
        GeocoderResponseMetaData: {
          found: string;
        };
      };
      featureMember: {
        GeoObject: {
          metaDataProperty: {
            GeocoderMetaData: {
              precision: string;
              text: string;
              kind: string;
              Address: {
                country_code: string;
                formatted: string;
                postal_code?: string;
                Components: {
                  kind: string;
                  name: string;
                }[];
              };
              AddressDetails: {
                Country: {
                  AddressLine: string;
                  CountryNameCode: string;
                  CountryName: string;
                  AdministrativeArea?: {
                    AdministrativeAreaName: string;
                    Locality?: {
                      LocalityName: string;
                      Thoroughfare?: {
                        ThoroughfareName: string;
                        Premise?: {
                          PremiseNumber: string;
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          name: string;
          description: string;
          boundedBy: {
            Envelope: {
              lowerCorner: string;
              upperCorner: string;
            };
          };
          uri: string;
          Point: {
            pos: string;
          };
        };
      }[];
    };
  };
}

const YANDEX_API_KEY = '9c74bdc7-1c3b-464d-b275-c895a98ba57e';
const YANDEX_GEOCODE_API_KEY = 'bf71e5b3-f0d3-40fb-9873-acfae7046bd1';

export const yandexService = {
  searchAddress: async (
    text: string,
    options: { lang?: string; results?: number; printAddress?: boolean } = {}
  ): Promise<YandexSuggestResponse> => {
    const { lang = 'ru', results = 10, printAddress = false } = options;

    const url = `https://suggest-maps.yandex.ru/v1/suggest?apikey=${YANDEX_API_KEY}&text=${encodeURIComponent(text)}&lang=${lang === 'uz' ? 'uzb' : lang}&results=${results}&print_address=${printAddress ? 1 : 0}&attrs=uri&types=house,street`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Yandex API error: ${response.status}`);
    }

    return await response.json();
  },

  searchObjects: async (
    text: string,
    options: {
      lang?: string;
      results?: number;
      printAddress?: boolean;
      types?: YandexSuggestTypes;
      ll?: string;
      spn?: string;
    } = {}
  ): Promise<YandexSuggestResponse> => {
    const {
      lang = 'ru',
      results = 10,
      printAddress = false,
      types = YandexSuggestTypes.biz,
      ll,
      spn = '0.1,0.1',
    } = options;
    const url = new URL('https://suggest-maps.yandex.ru/v1/suggest');
    url.searchParams.set('apikey', YANDEX_API_KEY);
    url.searchParams.set('text', text);
    url.searchParams.set('lang', lang === 'uz' ? 'uzb' : lang);
    url.searchParams.set('results', results.toString());
    url.searchParams.set('print_address', printAddress ? '1' : '0');
    url.searchParams.set('attrs', 'uri');
    url.searchParams.set('types', types.toString());
    url.searchParams.set('spn', spn);

    if (ll) {
      url.searchParams.set('ll', ll);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Yandex API error: ${response.status}`);
    }

    return await response.json();
  },

  geocodeByUri: async (
    uri: string,
    options: { lang?: string; format?: string } = {}
  ): Promise<YandexGeocodeResponse> => {
    const { lang = 'ru', format = 'json' } = options;

    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_GEOCODE_API_KEY}&uri=${encodeURIComponent(uri)}&lang=${lang}&format=${format}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Yandex Geocode API error: ${response.status}`);
    }

    return await response.json();
  },
};
