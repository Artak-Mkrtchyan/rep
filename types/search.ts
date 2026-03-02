export type ListingType = 'BUY' | 'RENT';

export type PropertyTypeValue =
  | 'HOUSE'
  | 'APARTMENT'
  | 'COMMERCIAL_SPACE'
  | 'LAND'
  | 'PARKING_SPACE'
  | 'GARAGE';

export type SearchFilters = {
  query: string;
  listingType: ListingType;
  propertyTypes: PropertyTypeValue[];
  priceMin: string;
  priceMax: string;
};
