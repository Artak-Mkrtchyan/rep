import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/lib/api/auth.types';
import { bookingsService } from '@/lib/api/bookings';
import type { SearchResponse } from '@/types/applications';
import type {
  BookingDetails,
  BookingListItem,
  BookingPhoto,
  BookingsFilterValues,
  CreateAssessmentBookingRequest,
  CreatePhotoShootBookingRequest,
} from '@/types/bookings';
import { ServiceType, BookingStatus } from '@/types/bookings';

export const BOOKINGS_QUERY_KEY = 'bookings';

/** Bookings that are Completed and type Photo Shoot, eligible for uploading photos to announcement. */
export const useEligibleBookingsForUpload = (enabled: boolean = true) => {
  return useQuery<SearchResponse<BookingListItem>, ApiError>({
    queryKey: [BOOKINGS_QUERY_KEY, 'eligible-for-upload'],
    queryFn: () =>
      bookingsService.searchMyBookings({
        filter: {
          types: [ServiceType.PHOTO_SHOOT],
          statuses: [BookingStatus.COMPLETED],
        },
        pagination: {
          pageNumber: 0,
          pageSize: 100,
        },
        sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
      }),
    enabled,
  });
};

const PAGE_SIZE = 10;

const getNextPageParam = (lastPage: SearchResponse<unknown>) => {
  if (lastPage.totalPages <= 0) return undefined;
  if (lastPage.pageNumber + 1 >= lastPage.totalPages) return undefined;
  return lastPage.pageNumber + 2;
};

/**
 * Build the filter object for `searchMyBookings` from UI filter state.
 * Empty/undefined fields are stripped so the backend receives a minimal payload.
 */
const buildSearchFilter = (filter: BookingsFilterValues): Record<string, unknown> => {
  const out: Record<string, unknown> = {};

  if (filter.bookingId?.trim()) {
    out.publicIds = [filter.bookingId.trim()];
  }
  if (filter.serviceProviders && filter.serviceProviders.length > 0) {
    out.types = filter.serviceProviders;
  }
  if (filter.status && filter.status.length > 0) {
    out.statuses = filter.status;
  }
  if (filter.scheduledAt && (filter.scheduledAt.min || filter.scheduledAt.max)) {
    out.scheduledAt = {
      ...(filter.scheduledAt.min && { min: filter.scheduledAt.min }),
      ...(filter.scheduledAt.max && { max: filter.scheduledAt.max }),
    };
  }

  return out;
};

/**
 * Infinite list of "my bookings", driven by the filter chips/search on the
 * Bookings list screen. Returns one page at a time (10 items per page).
 */
export const useMyBookingsInfinite = (
  filter: BookingsFilterValues = {},
  enabled: boolean = true
) => {
  return useInfiniteQuery<SearchResponse<BookingListItem>, ApiError>({
    queryKey: [BOOKINGS_QUERY_KEY, 'my-bookings', filter],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      bookingsService.searchMyBookings({
        filter: buildSearchFilter(filter),
        pagination: {
          pageNumber: (pageParam as number) - 1,
          pageSize: PAGE_SIZE,
        },
        sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
      }),
    getNextPageParam,
    enabled,
  });
};

/** Detail of a single booking by id. */
export const useBookingById = (id: string | undefined, enabled: boolean = true) => {
  return useQuery<BookingDetails, ApiError>({
    queryKey: [BOOKINGS_QUERY_KEY, 'detail', id],
    queryFn: () => bookingsService.getBookingById(id!),
    enabled: enabled && !!id,
  });
};

/** Photo metadata for a photo-shoot booking, paged 0-based. */
export const usePhotoShootPhotos = (
  bookingId: string | undefined,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true
) => {
  return useQuery<SearchResponse<BookingPhoto>, ApiError>({
    queryKey: [BOOKINGS_QUERY_KEY, 'photos', bookingId, page, size],
    queryFn: () => bookingsService.getPhotoShootPhotos(bookingId!, page, size),
    enabled: enabled && !!bookingId,
  });
};

/** Create an assessment-expert booking, then invalidate the list cache. */
export const useCreateAssessmentBooking = () => {
  const queryClient = useQueryClient();
  return useMutation<BookingListItem, ApiError, CreateAssessmentBookingRequest>({
    mutationFn: (data) => bookingsService.createAssessmentBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  });
};

/** Create a photo-shoot booking, then invalidate the list cache. */
export const useCreatePhotoShootBooking = () => {
  const queryClient = useQueryClient();
  return useMutation<BookingListItem, ApiError, CreatePhotoShootBookingRequest>({
    mutationFn: (data) => bookingsService.createPhotoShootBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  });
};

/** Cancel a photo-shoot/assessment booking by the author. */
export const useCancelPhotoShootBookingByAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, string>({
    mutationFn: (id: string) => bookingsService.cancelPhotoShootBookingByAuthor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  });
};

/** Complete a photo-shoot/assessment booking by the author. */
export const useCompletePhotoShootBookingByAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, string>({
    mutationFn: (id: string) => bookingsService.completePhotoShootBookingByAuthor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  });
};

