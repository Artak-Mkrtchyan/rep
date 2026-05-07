import type { SearchRequest, SearchResponse } from '@/types/applications';
import type {
  BookingDetails,
  BookingListItem,
  BookingPhoto,
  CreateAssessmentBookingRequest,
  CreatePhotoShootBookingRequest,
} from '@/types/bookings';

import type { ApiResponse } from './auth.types';
import { httpClient } from './http/client';

/**
 * Service module wrapping the `/v1/bookings/...` endpoints
 * (Swagger group `05. Bookings`).
 *
 * Mirrors the contract used by `pics-web/lib/api/bookings.ts` so that
 * mobile and web behave identically when talking to the same backend.
 */
export const bookingsService = {
  /**
   * Paginated search of the current user's bookings.
   *
   * Backed by `POST /v1/bookings/search/for-screen/my-bookings`.
   */
  searchMyBookings: async (data: SearchRequest): Promise<SearchResponse<BookingListItem>> => {
    const response = await httpClient.post<ApiResponse<SearchResponse<BookingListItem>>>(
      '/v1/bookings/search/for-screen/my-bookings',
      data || {},
      { requiresAuth: true }
    );
    return response.data || (response as unknown as SearchResponse<BookingListItem>);
  },

  /** `GET /v1/bookings/{id}`. */
  getBookingById: async (id: string): Promise<BookingDetails> => {
    const response = await httpClient.get<ApiResponse<BookingDetails>>(
      `/v1/bookings/${encodeURIComponent(id)}`,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as BookingDetails);
  },

  /** `POST /v1/bookings/assessments`. */
  createAssessmentBooking: async (
    data: CreateAssessmentBookingRequest
  ): Promise<BookingListItem> => {
    const response = await httpClient.post<ApiResponse<BookingListItem>>(
      '/v1/bookings/assessments',
      data,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as BookingListItem);
  },

  /** `POST /v1/bookings/photo-shoots`. */
  createPhotoShootBooking: async (
    data: CreatePhotoShootBookingRequest
  ): Promise<BookingListItem> => {
    const response = await httpClient.post<ApiResponse<BookingListItem>>(
      '/v1/bookings/photo-shoots',
      data,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as BookingListItem);
  },

  /**
   * Paginated photo metadata for a photo-shoot booking.
   *
   * Backed by `GET /v1/bookings/photo-shoots/{bookingId}/photos?page=&size=`.
   */
  getPhotoShootPhotos: async (
    bookingId: string,
    page: number = 0,
    size: number = 20
  ): Promise<SearchResponse<BookingPhoto>> => {
    const response = await httpClient.get<ApiResponse<SearchResponse<BookingPhoto>>>(
      `/v1/bookings/photo-shoots/${encodeURIComponent(bookingId)}/photos?page=${page}&size=${size}`,
      { requiresAuth: true }
    );
    return response.data || (response as unknown as SearchResponse<BookingPhoto>);
  },
};
