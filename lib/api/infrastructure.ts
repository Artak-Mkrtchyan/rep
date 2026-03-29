import { yandexService, YandexSuggestTypes } from './yandex';

const MAX_DISTANCE_METERS = 5000;
const MAX_RESULTS = 4;
const RESULTS_PER_CATEGORY = 5;
const SEARCH_SPAN = '0.045,0.045';

export enum InfrastructureObjectType {
  METRO = 'METRO',
  SUPERMARKET = 'SUPERMARKET',
  SCHOOL = 'SCHOOL',
  HOSPITAL = 'HOSPITAL',
  PHARMACY = 'PHARMACY',
  PARK = 'PARK',
  SHOPPING_MALL = 'SHOPPING_MALL',
  RESTAURANT = 'RESTAURANT',
  ATM = 'ATM',
  BANK = 'BANK',
  GAS_STATION = 'GAS_STATION',
  POLICE = 'POLICE',
  PARKING = 'PARKING',
  BEAUTY_SALON = 'BEAUTY_SALON',
  LAUNDRY = 'LAUNDRY',
}

export interface InfrastructureObject {
  type: InfrastructureObjectType;
  distanceInMeters: number;
}

interface CategoryConfig {
  type: InfrastructureObjectType;
  searchText: string;
  suggestType: YandexSuggestTypes;
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    type: InfrastructureObjectType.METRO,
    searchText: 'метро',
    suggestType: YandexSuggestTypes.metro,
  },
  {
    type: InfrastructureObjectType.SUPERMARKET,
    searchText: 'супермаркет',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.SCHOOL,
    searchText: 'школа',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.HOSPITAL,
    searchText: 'больница',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.PHARMACY,
    searchText: 'аптека',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.PARK,
    searchText: 'парк',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.SHOPPING_MALL,
    searchText: 'торговый центр',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.RESTAURANT,
    searchText: 'ресторан',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.ATM,
    searchText: 'банкомат',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.BANK,
    searchText: 'банк',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.GAS_STATION,
    searchText: 'заправка',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.POLICE,
    searchText: 'полиция',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.PARKING,
    searchText: 'парковка',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.BEAUTY_SALON,
    searchText: 'салон красоты',
    suggestType: YandexSuggestTypes.biz,
  },
  {
    type: InfrastructureObjectType.LAUNDRY,
    searchText: 'прачечная',
    suggestType: YandexSuggestTypes.biz,
  },
];

export const detectInfrastructureObjects = async (
  latitude: number,
  longitude: number
): Promise<InfrastructureObject[]> => {
  const ll = `${longitude},${latitude}`;

  const requests = CATEGORY_CONFIG.map((category) =>
    yandexService.searchObjects(category.searchText, {
      ll,
      spn: SEARCH_SPAN,
      types: category.suggestType,
      results: RESULTS_PER_CATEGORY,
    })
  );

  const results = await Promise.allSettled(requests);

  const nearestPerCategory: InfrastructureObject[] = [];

  for (let i = 0; i < CATEGORY_CONFIG.length; i++) {
    const result = results[i]!;
    if (result.status !== 'fulfilled') continue;

    const withinRadius =
      result.value.results?.filter((r) => r.distance && r.distance.value <= MAX_DISTANCE_METERS) ??
      [];

    if (withinRadius.length === 0) continue;

    const nearest = withinRadius.reduce((min, current) =>
      current.distance!.value < min.distance!.value ? current : min
    );

    nearestPerCategory.push({
      type: CATEGORY_CONFIG[i]!.type,
      distanceInMeters: Math.round(nearest.distance!.value),
    });
  }

  return nearestPerCategory.slice(0, MAX_RESULTS);
};
