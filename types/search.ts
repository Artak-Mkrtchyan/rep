export type ListingType = 'BUY' | 'RENT';

export type PropertyTypeValue =
  | 'HOUSE'
  | 'APARTMENT'
  | 'COMMERCIAL_SPACE'
  | 'LAND'
  | 'PARKING_SPACE'
  | 'GARAGE';

export type SortOption =
  | 'NEWEST_FIRST'
  | 'PRICE_LOW_TO_HIGH'
  | 'PRICE_HIGH_TO_LOW'
  | 'AREA_SMALL_TO_LARGE'
  | 'AREA_LARGE_TO_SMALL';

export type SearchFilters = {
  query: string;
  address: string;
  listingType: ListingType | null;
  propertyTypes: PropertyTypeValue[];
  priceMin: string;
  priceMax: string;
  sortOption: SortOption;
};
