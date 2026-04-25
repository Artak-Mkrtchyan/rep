import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { announcementsService } from '@/lib/api/announcements';
import { Announcement } from '@/types/api';

const FETCH_PAGE_SIZE = 50;
const DISPLAY_COUNT = 9;
const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

const featuredKey = ['announcements', 'featured'] as const;

function getRandomSample<T>(array: T[], sampleSize: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i] as T;
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = temp;
  }
  return shuffled.slice(0, sampleSize);
}

async function fetchFeaturedAnnouncements(): Promise<Announcement[]> {
  const response = await announcementsService.searchAnnouncements({
    filter: { statuses: ['ACTIVE'] },
    pagination: { pageNumber: 0, pageSize: FETCH_PAGE_SIZE },
    sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
  });
  return getRandomSample(response.content, DISPLAY_COUNT);
}

export function useFeaturedAnnouncements() {
  const query = useQuery({
    queryKey: featuredKey,
    queryFn: fetchFeaturedAnnouncements,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  return {
    announcements: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}

export function useToggleFavourite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFavourite }: { id: string; isFavourite: boolean }) =>
      isFavourite
        ? announcementsService.removeFromFavourites(id)
        : announcementsService.addToFavourites(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featuredKey });
    },
  });
}

export function useToggleComparison() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isForComparison }: { id: string; isForComparison: boolean }) =>
      isForComparison
        ? announcementsService.removeFromComparison(id)
        : announcementsService.addToComparison(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featuredKey });
    },
  });
}
