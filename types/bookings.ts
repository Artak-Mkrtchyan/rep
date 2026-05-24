import type { GeoDetailsDto, ListingType, Property } from '@/types/announcement';

import type { AvatarInfo } from './applications';

/**
 * Service provider type that fulfils a booking.
 * Mirrors `ServiceType` enum in pics-web/swagger spec.
 */
export enum ServiceType {
  PHOTO_SHOOT = 'PHOTO_SHOOT',
  ASSESSMENT = 'ASSESSMENT',
}

/**
 * Booking lifecycle status returned by the API.
 * Aligned with the Bookings Swagger group and pics-web `BookingStatus` enum.
 */
export enum BookingStatus {
  COMPLETED = 'COMPLETED',
  PENDING_FOR_CONFIRMATION = 'PENDING_FOR_CONFIRMATION',
  DECLINED = 'DECLINED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
  WORK_COMPLETED = 'WORK_COMPLETED',
}

/** Quick scheduled-date filter chip selected by the user. */
export type DateFilter = 'next_7_days' | 'this_week' | 'this_month' | 'custom' | '';

/**
 * Filter values used by the bookings list screen.
 * Sent to `POST /v1/bookings/search/for-screen/my-bookings`.
 */
export interface BookingsFilterValues {
  bookingId?: string;
  serviceProviders?: ServiceType[];
  status?: BookingStatus[];
  dateFilter?: DateFilter;
  scheduledAt?: {
    min?: string;
    max?: string;
  };
}

/** Service provider preview embedded in `BookingListItem`. */
export interface BookingAssignee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  scope: 'SERVICE_PROVIDER';
  avatarInfo?: AvatarInfo;
}

/** Booking creator preview embedded in `BookingListItem`. */
export interface BookingCreator {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  scope: string;
  avatarInfo?: AvatarInfo;
}

/** Item returned by `POST /v1/bookings/search/for-screen/my-bookings`. */
export interface BookingListItem {
  id: string;
  publicId: string;
  title: string;
  type: { code: ServiceType; name: string };
  status: { code: BookingStatus; name: string };
  geo: GeoDetailsDto;
  propertyType: Property;
  listingType: ListingType;
  minScheduledTime: string;
  maxScheduledTime: string;
  createdAt: string;
  updatedAt: string;
  createdBy: BookingCreator;
  assigneeId?: string;
  assignee?: BookingAssignee;
}

/** Single feedback entry left by a service provider on a booking. */
export interface BookingFeedback {
  createdAt: string;
  createdBy: string;
  text: string;
}

/** Response of `GET /v1/bookings/{id}`. */
export interface BookingDetails {
  id: string;
  publicId: string;
  title: string;
  details: string;
  type: ServiceType;
  status: { code: BookingStatus; name: string };
  geo: GeoDetailsDto;
  listingType: ListingType;
  propertyType: Property;
  minScheduledTime: string;
  maxScheduledTime: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  applicationId?: string;
  applicationPublicId?: string;
  creatorCompanyId?: string;
  numberOfUploadedPhotos: number;
  assigneeId?: string;
  assignee?: BookingAssignee;
  feedbacks?: BookingFeedback[];
}

interface BookingCreateBase {
  applicationId?: string;
  details: string;
  geo: GeoDetailsDto;
  listingType: ListingType;
  propertyType: Property;
  title: string;
  /** ISO datetime string, e.g. `2026-05-12T10:00:00.000Z` */
  minScheduledTime: string;
  /** ISO datetime string, e.g. `2026-05-12T10:00:00.000Z` */
  maxScheduledTime: string;
}

export interface CreateAssessmentBookingRequest extends BookingCreateBase {
  type: ServiceType.ASSESSMENT;
}

export interface CreatePhotoShootBookingRequest extends BookingCreateBase {
  type: ServiceType.PHOTO_SHOOT;
}

/** Photo metadata returned for photo-shoot bookings. */
export interface BookingPhoto {
  id: string;
  fileName: string;
  fileType: string;
  sizeInBytes: number;
  url: string;
  thumbnailUrl?: string;
  createdAt?: string;
}
