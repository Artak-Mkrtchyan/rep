import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { announcementsService } from '@/lib/api/announcements';
import { ApiError } from '@/lib/api/auth.types';
import { useAuth } from '@/context/AuthContext';
import { decodeAccessToken } from '@/lib/jwt';
import type { Announcement, ItemsListApiResponse } from '@/types/api';
import {
  AnnouncementStatus,
  ClosureReason,
  type AnnouncementListItem,
  type AnnouncementStatisticsByStatusResponse,
} from '@/types/my-announcements';

export const MY_ANNOUNCEMENTS_QUERY_KEY = 'my-announcements';

type SearchResponse<T> = ItemsListApiResponse<T>;

const getNextPageParam = (lastPage: SearchResponse<unknown>) => {
  if (lastPage.totalPages <= 0) return undefined;
  if (lastPage.pageNumber + 1 >= lastPage.totalPages) return undefined;
  return lastPage.pageNumber + 2;
};

/** Extract the actor/account ID from the JWT's `aid` field. */
function useActorId(): string | undefined {
  const { accessToken } = useAuth();
  return useMemo(() => {
    if (!accessToken) return undefined;
    const payload = decodeAccessToken(accessToken);
    // The JWT contains `aid` (account/actor ID), not `sub`
    return (payload as Record<string, unknown>)?.aid as string | undefined;
  }, [accessToken]);
}

const buildUserFilter = (userId?: string) =>
  userId
    ? {
        _or_: [
          { assignedBrokerCompanyIds: [userId] },
          { assignedBrokerIds: [userId] },
          { createdBy: [userId] },
        ],
      }
    : {};

export const useGetMyAnnouncementsInfinite = (
  params: { filter?: AnnouncementStatus | ClosureReason; pageSize?: number } = {},
  enabled = true
) => {
  const userId = useActorId();

  return useInfiniteQuery<SearchResponse<AnnouncementListItem>, ApiError>({
    queryKey: [MY_ANNOUNCEMENTS_QUERY_KEY, 'list', params, userId],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      announcementsService.getMyAnnouncements({
        filter: {
          ...(params.filter &&
          Object.values(AnnouncementStatus).includes(params.filter as AnnouncementStatus)
            ? { statuses: [params.filter] }
            : params.filter
              ? { closureReasons: [params.filter] }
              : {}),
          ...buildUserFilter(userId),
        },
        pagination: {
          pageNumber: (pageParam as number) - 1,
          pageSize: params.pageSize || 5,
        },
        sorts: [{ sort: 'UPDATED_AT', direction: 'DESC' }],
      }),
    getNextPageParam,
    enabled: enabled && !!userId,
  });
};

export const useGetMyAnnouncementsStatistics = (enabled = true) => {
  const userId = useActorId();

  return useQuery<AnnouncementStatisticsByStatusResponse, ApiError>({
    queryKey: [MY_ANNOUNCEMENTS_QUERY_KEY, 'statistics', userId],
    queryFn: () => announcementsService.getAnnouncementsStatisticsByStatuses(buildUserFilter(userId)),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCloseAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<Announcement, ApiError, { id: string; closureReason: ClosureReason }>({
    mutationFn: ({ id, closureReason }) =>
      announcementsService.closeAnnouncement(id, closureReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_ANNOUNCEMENTS_QUERY_KEY] });
    },
  });
};

export const useReopenAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<Announcement, ApiError, string>({
    mutationFn: (id) => announcementsService.reopenAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_ANNOUNCEMENTS_QUERY_KEY] });
    },
  });
};
