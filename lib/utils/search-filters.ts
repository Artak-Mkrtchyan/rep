import type { SearchRequest } from '@/types/api';
import type { SearchFilters } from '@/types/search';

const LISTING_TYPE_MAP = {
  BUY: 'FOR_SALE',
  RENT: 'FOR_RENT',
} as const;

export function buildSearchRequest(filters: SearchFilters, page = 0, pageSize = 10): SearchRequest {
  const apiFilter: Record<string, unknown> = {};

  if (filters.query) {
    apiFilter.titleAndDescriptionFTS = filters.query;
  }

  apiFilter.listingTypes = [LISTING_TYPE_MAP[filters.listingType]];

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
    } else {
      apiFilter.salePrice = range;
    }
  }

  return {
    filter: apiFilter,
    pagination: { pageNumber: page, pageSize },
    sorts: [{ sort: 'UPDATED_AT', direction: 'DESC' }],
  };
}
