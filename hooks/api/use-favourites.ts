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

  const fetchFavourites = useCallback(async () => {
    if (!hasLoadedRef.current) {
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
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load favourites');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [page, pageSize]);

  const toggle = useCallback(
    async (id: string, isFavourite: boolean) => {
      setIsToggling(true);
      try {
        if (isFavourite) {
          await announcementsService.removeFromFavourites(id);
        } else {
          await announcementsService.addToFavourites(id);
        }
        await fetchFavourites();
      } catch (err) {
        console.error('Failed to toggle favourite:', err);
        throw err;
      } finally {
        setIsToggling(false);
      }
    },
    [fetchFavourites]
  );

  useEffect(() => {
    mountedRef.current = true;
    fetchFavourites();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchFavourites]);

  useFocusEffect(
    useCallback(() => {
      fetchFavourites();
    }, [fetchFavourites])
  );

  return {
    favourites,
    isLoading,
    isToggling,
    error,
    totalElements,
    totalPages,
    refetch: fetchFavourites,
    toggle,
  };
}
