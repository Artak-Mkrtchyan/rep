import type { YandexGeocodeResponse } from '@/lib/api/yandex';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/i18n';
import { EMPTY_FLAT_GEO } from '@/store/announcementStore';
import type { GeoDetailsDto, LangFormDTO } from '@/types/announcement';

type GeoObject = NonNullable<
  YandexGeocodeResponse['response']['GeoObjectCollection']['featureMember'][0]
>['GeoObject'];

const getGeoObject = (res?: YandexGeocodeResponse): GeoObject | undefined =>
  res?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

const parsePoint = (pos?: string): { lat: number; lng: number } | undefined => {
  if (!pos) return undefined;
  const parts = pos.trim().split(/\s+/).map(Number);
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return undefined;
  const [lng, lat] = parts;
  return { lat, lng };
};

type ComponentsAcc = {
  country: string;
  province: string;
  locality: string;
  district: string;
  street: string;
  house?: string;
};

const processComponents = (geoObject: GeoObject): ComponentsAcc => {
  const components =
    geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components ?? [];

  return components.reduce<ComponentsAcc>(
    (acc, component) => {
      const kind = component.kind?.toLowerCase();
      switch (kind) {
        case 'country':
          acc.country = acc.country ? `${acc.country}, ${component.name}` : component.name;
          break;
        case 'province':
          acc.province = acc.province ? `${acc.province}, ${component.name}` : component.name;
          break;
        case 'locality':
          acc.locality = acc.locality ? `${acc.locality}, ${component.name}` : component.name;
          break;
        case 'district':
          acc.district = acc.district ? `${acc.district}, ${component.name}` : component.name;
          break;
        case 'street':
          acc.street = acc.street ? `${acc.street}, ${component.name}` : component.name;
          break;
        case 'house':
          acc.house = component.name;
          break;
        default:
          break;
      }
      return acc;
    },
    {
      country: '',
      province: '',
      locality: '',
      district: '',
      street: '',
      house: undefined,
    }
  );
};

const emptyLangForm = (): LangFormDTO => ({ ru: '', en: '', uz: '' });

export type MultilangGeocodeData = {
  ru?: YandexGeocodeResponse;
  en?: YandexGeocodeResponse;
  uz?: YandexGeocodeResponse;
};

/**
 * Собирает `GeoDetailsDto` из ответов геокодера по ru / en / uz:
 * для каждого языка берётся свой `GeoObject`, заполняются поля `LangFormDTO`.
 * Координаты — из первого доступного ответа (порядок: ru → en → uz).
 */
export const flatGeoFromMultilangGeocode = (data: MultilangGeocodeData): GeoDetailsDto => {
  const hasAny = SUPPORTED_LANGUAGES.some((lang) => getGeoObject(data[lang]));

  if (!hasAny) {
    return { ...EMPTY_FLAT_GEO };
  }

  const out: GeoDetailsDto = {
    formattedAddress: { ...EMPTY_FLAT_GEO.formattedAddress },
    country: { ...EMPTY_FLAT_GEO.country },
    locality: { ...EMPTY_FLAT_GEO.locality },
    province: { ...EMPTY_FLAT_GEO.province },
    district: EMPTY_FLAT_GEO.district ? { ...EMPTY_FLAT_GEO.district } : emptyLangForm(),
    street: { ...EMPTY_FLAT_GEO.street },
  };

  let latitude: number | undefined;
  let longitude: number | undefined;

  for (const lang of SUPPORTED_LANGUAGES) {
    const geo = getGeoObject(data[lang]);
    if (!geo) continue;

    if (latitude === undefined && longitude === undefined) {
      const coords = parsePoint(geo.Point?.pos);
      latitude = coords?.lat;
      longitude = coords?.lng;
    }

    const meta = geo.metaDataProperty?.GeocoderMetaData;
    out.formattedAddress[lang] = meta?.text ?? '';

    const parts = processComponents(geo);
    out.country[lang] = parts.country;
    out.province[lang] = parts.province;
    out.locality[lang] = parts.locality || parts.district;
    if (out.district) {
      out.district[lang] = parts.district;
    }
    out.street[lang] = parts.street;

    if (parts.house) {
      if (!out.house) {
        out.house = emptyLangForm();
      }
      out.house[lang] = parts.house;
    }
  }

  out.latitude = latitude;
  out.longitude = longitude;

  if (out.house && !out.house.ru && !out.house.en && !out.house.uz) {
    out.house = undefined;
  }

  return out;
};
