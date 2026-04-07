import { useCallback, useRef, useState } from 'react';

import { announcementsService } from '@/lib/api/announcements';
import { expandBounds, isWithinBounds } from '@/lib/utils/map-helpers';
import { buildSearchRequest } from '@/lib/utils/search-filters';
import type { Announcement, GeoRectangle } from '@/types/api';
import type { SearchFilters } from '@/types/search';

const PAGE_SIZE = 100;

export interface UseMapSearchAnnouncementsResult {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  totalElements: number;
  searchWithBounds: (filters: SearchFilters, geoRectangle: GeoRectangle) => Promise<void>;
  reset: () => void;
}

export function useMapSearchAnnouncements(): UseMapSearchAnnouncementsResult {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);

  const loadedBoundsRef = useRef<GeoRectangle | null>(null);
  const mountedRef = useRef(true);

  const searchWithBounds = useCallback(
    async (filters: SearchFilters, geoRectangle: GeoRectangle) => {
      // Skip fetch if the new bounds are within already-loaded area
      if (loadedBoundsRef.current && isWithinBounds(geoRectangle, loadedBoundsRef.current)) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const request = buildSearchRequest(filters, 0, PAGE_SIZE, geoRectangle);
        const response = await announcementsService.searchAnnouncements(request);

        if (!mountedRef.current) return;

        // Deduplicate by ID when accumulating
        setAnnouncements((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newItems = response.content.filter((a) => !existingIds.has(a.id));
          if (newItems.length === 0) return prev;
          return [...prev, ...newItems];
        });
        setTotalElements(response.totalElements);

        // Expand loaded bounds to include the new area
        loadedBoundsRef.current = expandBounds(loadedBoundsRef.current, geoRectangle);

        // Auto-load remaining pages for this bounds
        if (response.pageNumber + 1 < response.totalPages) {
          const totalPages = response.totalPages;
          for (let page = 1; page < totalPages; page++) {
            const nextRequest = buildSearchRequest(filters, page, PAGE_SIZE, geoRectangle);
            const nextResponse = await announcementsService.searchAnnouncements(nextRequest);
            if (!mountedRef.current) return;

            setAnnouncements((prev) => {
              const ids = new Set(prev.map((a) => a.id));
              const items = nextResponse.content.filter((a) => !ids.has(a.id));
              if (items.length === 0) return prev;
              return [...prev, ...items];
            });
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Search failed');
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const reset = useCallback(() => {
    loadedBoundsRef.current = null;
    setAnnouncements([]);
    setTotalElements(0);
    setError(null);
  }, []);

  return {
    announcements,
    isLoading,
    error,
    totalElements,
    searchWithBounds,
    reset,
  };
}
