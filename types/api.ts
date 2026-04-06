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
  createdAt?: string;
  createdBy?: string;
  archived: boolean;
  listingType: ListingType;
  propertyType: PropertyType;
  processType: ProcessType;
  geo: GeoDetailsDto;
  status?: { code: string; name: string };
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
  infrastructureObjects?: InfrastructureObject[];
  documents?: AnnouncementDocument[];
}

export interface InfrastructureObject {
  type: string;
  distanceInMeters: number;
}

export interface PriceChangeHistory {
  announcementId: string;
  createdAt: string;
  createdBy: string;
  type: 'announcement-price-changed';
  listingType: ListingType;
  rentDetailsChange: {
    monthlyRent: {
      changed: boolean;
      newValue: number;
      oldValue: number;
    };
    securityDeposit: {
      changed: boolean;
      newValue: number;
      oldValue: number;
    };
  };
  saleDetailsChange: {
    price: {
      changed: boolean;
      newValue: number;
      oldValue: number;
    };
  };
}

export interface AnnouncementDocument {
  id: string;
  fileName: string;
  contentType: string;
  url: string;
  sizeInBytes: number;
}
