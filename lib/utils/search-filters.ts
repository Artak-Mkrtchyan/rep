import type { GeoRectangle, SearchRequest } from '@/types/api';
import type { SearchFilters, SortOption } from '@/types/search';

const LISTING_TYPE_MAP = {
  BUY: 'FOR_SALE',
  RENT: 'FOR_RENT',
} as const;

function getSortsFromOption(
  sortOption: SortOption
): { sort: string; direction: 'ASC' | 'DESC' }[] {
  switch (sortOption) {
    case 'PRICE_LOW_TO_HIGH':
      return [
        { sort: 'SALE_PRICE', direction: 'ASC' },
        { sort: 'MONTHLY_RENT', direction: 'ASC' },
      ];
    case 'PRICE_HIGH_TO_LOW':
      return [
        { sort: 'SALE_PRICE', direction: 'DESC' },
        { sort: 'MONTHLY_RENT', direction: 'DESC' },
      ];
    case 'AREA_SMALL_TO_LARGE':
      return [{ sort: 'AREA', direction: 'ASC' }];
    case 'AREA_LARGE_TO_SMALL':
      return [{ sort: 'AREA', direction: 'DESC' }];
    case 'NEWEST_FIRST':
    default:
      return [{ sort: 'UPDATED_AT', direction: 'DESC' }];
  }
}

export function buildSearchRequest(
  filters: SearchFilters,
  page = 0,
  pageSize = 10,
  geoRectangle?: GeoRectangle
): SearchRequest {
  const apiFilter: Record<string, unknown> = {};

  if (filters.query) {
    apiFilter.titleAndDescriptionFTS = filters.query;
  }

  if (filters.listingType) {
    apiFilter.listingTypes = [LISTING_TYPE_MAP[filters.listingType]];
  }

  if (filters.propertyTypes.length > 0) {
    apiFilter.propertyTypes = filters.propertyTypes;
  }

  const priceMin = filters.priceMin ? Number(filters.priceMin) : undefined;
  const priceMax = filters.priceMax ? Number(filters.priceMax) : undefined;

  if (priceMin !== undefined || priceMax !== undefined) {
    const range: Record<string, number> = {};
    if (priceMin !== undefined) range.min = priceMin;
    if (priceMax !== undefined) range.max = priceMax;

    if (filters.listingType === 'RENT') {
      apiFilter.monthlyRent = range;
    } else if (filters.listingType === 'BUY') {
      apiFilter.salePrice = range;
    } else {
      apiFilter._or_ = [{ monthlyRent: range }, { salePrice: range }];
    }
  }

  if (geoRectangle) {
    apiFilter.geoRectangle = geoRectangle;
  }

  return {
    filter: apiFilter,
    pagination: { pageNumber: page, pageSize },
    sorts: getSortsFromOption(filters.sortOption),
  };
}
