import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';

import { announcementsService } from '@/lib/api/announcements';
import { Announcement } from '@/types/api';

export interface UseFavouritesResult {
  favourites: Announcement[];
  isLoading: boolean;
  isToggling: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  refetch: () => Promise<void>;
  toggle: (id: string, isFavourite: boolean) => Promise<void>;
  toggleComparison: (id: string, isForComparison: boolean) => Promise<void>;
}

export function useFavourites(page = 0, pageSize = 20): UseFavouritesResult {
  const [favourites, setFavourites] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const mountedRef = useRef(true);
  const hasLoadedRef = useRef(false);
  const isDirtyRef = useRef(false);

  const fetchFavourites = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      const shouldShowLoading =
        !silent && (!hasLoadedRef.current || isDirtyRef.current);
      if (shouldShowLoading) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const response = await announcementsService.getFavourites(page, pageSize);
        if (mountedRef.current) {
          setFavourites(response.content);
          setTotalElements(response.totalElements);
          setTotalPages(response.totalPages);
          hasLoadedRef.current = true;
          isDirtyRef.current = false;
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load favourites');
        }
      } finally {
        if (mountedRef.current && shouldShowLoading) {
          setIsLoading(false);
        }
      }
    },
    [page, pageSize]
  );

  const toggle = useCallback(
    async (id: string, isFavourite: boolean) => {
      setIsToggling(true);
      try {
        if (isFavourite) {
          await announcementsService.removeFromFavourites(id);
          // Update local state to mark as unfavourited instead of refetching,
          // so the item remains visible on the Favourites page until the user
          // refreshes or navigates away.
          isDirtyRef.current = true;
          setFavourites((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, favourite: false } : item
            )
          );
        } else {
          await announcementsService.addToFavourites(id);
          isDirtyRef.current = true;
          setFavourites((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, favourite: true } : item
            )
          );
        }
      } catch (err) {
        console.error('Failed to toggle favourite:', err);
        throw err;
      } finally {
        setIsToggling(false);
      }
    },
    []
  );

  const toggleComparison = useCallback(
    async (id: string, isForComparison: boolean) => {
      try {
        if (isForComparison) {
          await announcementsService.removeFromComparison(id);
        } else {
          await announcementsService.addToComparison(id);
        }
        isDirtyRef.current = true;
        setFavourites((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, forComparison: !isForComparison } : item
          )
        );
      } catch (err) {
        console.error('Failed to toggle comparison:', err);
        throw err;
      }
    },
    []
  );

  const refetch = useCallback(() => fetchFavourites(), [fetchFavourites]);

  useEffect(() => {
    mountedRef.current = true;
    fetchFavourites();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchFavourites]);

  useFocusEffect(
    useCallback(() => {
      fetchFavourites({ silent: true });
    }, [fetchFavourites])
  );

  return {
    favourites,
    isLoading,
    isToggling,
    error,
    totalElements,
    totalPages,
    refetch,
    toggle,
    toggleComparison,
  };
}
