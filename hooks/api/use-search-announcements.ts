import { useCallback, useRef, useState } from 'react';

import { announcementsService } from '@/lib/api/announcements';
import { buildSearchRequest } from '@/lib/utils/search-filters';
import type { Announcement } from '@/types/api';
import type { SearchFilters } from '@/types/search';

const PAGE_SIZE = 10;

export interface UseSearchAnnouncementsResult {
  announcements: Announcement[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  totalElements: number;
  hasMore: boolean;
  search: (filters: SearchFilters) => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useSearchAnnouncements(): UseSearchAnnouncementsResult {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const pageRef = useRef(0);
  const filtersRef = useRef<SearchFilters | null>(null);
  const mountedRef = useRef(true);

  const search = useCallback(async (filters: SearchFilters) => {
    filtersRef.current = filters;
    pageRef.current = 0;
    setIsLoading(true);
    setError(null);

    try {
      const request = buildSearchRequest(filters, 0, PAGE_SIZE);
      const response = await announcementsService.searchAnnouncements(request);
      if (mountedRef.current) {
        setAnnouncements(response.content);
        setTotalElements(response.totalElements);
        setHasMore(response.pageNumber + 1 < response.totalPages);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setAnnouncements([]);
        setTotalElements(0);
        setHasMore(false);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!filtersRef.current || !hasMore || isLoadingMore) return;

    const nextPage = pageRef.current + 1;
    setIsLoadingMore(true);

    try {
      const request = buildSearchRequest(filtersRef.current, nextPage, PAGE_SIZE);
      const response = await announcementsService.searchAnnouncements(request);
      if (mountedRef.current) {
        pageRef.current = nextPage;
        setAnnouncements((prev) => [...prev, ...response.content]);
        setTotalElements(response.totalElements);
        setHasMore(response.pageNumber + 1 < response.totalPages);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load more');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoadingMore(false);
      }
    }
  }, [hasMore, isLoadingMore]);

  return {
    announcements,
    isLoading,
    isLoadingMore,
    error,
    totalElements,
    hasMore,
    search,
    loadMore,
  };
}
