export interface ItemsListApiResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface SearchRequest {
  filter?: {
    [key: string]: unknown;
  };
  pagination?: {
    pageNumber: number;
    pageSize: number;
  };
  sorts?: {
    direction: 'ASC' | 'DESC';
    sort: string;
  }[];
}

export enum ListingType {
  sale = 'FOR_SALE',
  rent = 'FOR_RENT',
}

export enum PropertyType {
  apartment = 'APARTMENT',
  house = 'HOUSE',
  commercial_space = 'COMMERCIAL_SPACE',
  land = 'LAND',
  parking_space = 'PARKING_SPACE',
  garage = 'GARAGE',
}

export enum ProcessType {
  individual = 'AS_INDIVIDUAL',
  broker = 'AS_BROKER',
}

export type LangFormDTO = {
  [key: string]: string | undefined;
};

export type GeoDetailsDto = {
  formattedAddress: LangFormDTO;
  latitude?: number;
  longitude?: number;
  country: LangFormDTO;
  locality: LangFormDTO;
  province: LangFormDTO;
  district?: LangFormDTO;
  street: LangFormDTO;
  house?: LangFormDTO;
};

export type RentDetailsDto = {
  monthlyRent: number;
  securityDeposit?: number;
};

export type SaleDetailsDto = {
  price: number;
};

export type MediaFile = {
  id: string;
  url: string;
  thumbnailId?: string;
  thumbnailUrl?: string;
  createdAt: string;
  fileName: string;
  fileType: string;
  sizeInBytes: number;
  thumbnailSupported?: boolean;
};

export type PropertyDetailsDto = {
  areaM2: number;
  attributes?: Record<string, unknown>;
  description?: string;
};

export interface Announcement {
  id: string;
  archived: boolean;
  listingType: ListingType;
  propertyType: PropertyType;
  processType: ProcessType;
  geo: GeoDetailsDto;
  needPhotographer: boolean;
  needAssessmentExpert: boolean;
  title: string;
  description: string;
  saleDetails?: SaleDetailsDto;
  rentDetails?: RentDetailsDto;
  mediaFiles: MediaFile[];
  property: PropertyDetailsDto;
  favourite: boolean;
  forComparison: boolean;
  publicId: string;
}
