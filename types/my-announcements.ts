import type { ListingType, RentDetailsDto, SaleDetailsDto } from './api';

export enum AnnouncementStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export enum ClosureReason {
  SOLD_OUT = 'SOLD_OUT',
  GIVEN_FOR_RENT = 'GIVEN_FOR_RENT',
  WITHDRAWN_FOR_OTHER_REASONS = 'WITHDRAWN_FOR_OTHER_REASONS',
  VIOLATION = 'VIOLATION',
}

/** Geo fields from the my-announcements endpoint are plain strings (not LangFormDTO). */
export type AnnouncementListGeo = {
  formattedAddress?: string;
  country?: string;
  province?: string;
  locality?: string;
  district?: string;
  street?: string;
  house?: string;
  latitude?: number;
  longitude?: number;
};

export type AnnouncementListItem = {
  id: string;
  publicId: string;
  createdAt: string;
  updatedAt?: string;
  title: string;
  status: {
    code: AnnouncementStatus;
    name: string;
  };
  geo: AnnouncementListGeo;
  listingType: ListingType;
  rentDetails?: RentDetailsDto;
  saleDetails?: SaleDetailsDto;
  firstMediaFile: {
    thumbnailUrl: string;
  };
  assignedBroker?: {
    id?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  assignedBrokerCompany?: {
    id?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
  closureReason?: {
    code: ClosureReason;
    name: string;
  };
  createdBy?: {
    fullName: string;
    id: string;
  };
};

export interface AnnouncementStatisticsByStatusResponse {
  counterByStatuses: Record<AnnouncementStatus, number>;
  countersByClosureReasons: Record<ClosureReason, number>;
}
