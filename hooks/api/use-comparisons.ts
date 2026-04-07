import { useCallback, useEffect, useRef, useState } from 'react';

import { announcementsService } from '@/lib/api/announcements';
import type { Announcement } from '@/types/api';

export function useComparisons() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await announcementsService.getComparisons(0, 50);
      if (mountedRef.current) {
        setAnnouncements(data.content);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load comparisons');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const removeFromComparison = useCallback(
    async (id: string) => {
      try {
        await announcementsService.removeFromComparison(id);
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error('Failed to remove from comparison:', err);
      }
    },
    []
  );

  const toggleFavourite = useCallback(async (id: string, wasFavourite: boolean) => {
    try {
      if (wasFavourite) {
        await announcementsService.removeFromFavourites(id);
      } else {
        await announcementsService.addToFavourites(id);
      }
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, favourite: !wasFavourite } : a))
      );
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [fetch]);

  return {
    announcements,
    isLoading,
    error,
    refetch: fetch,
    removeFromComparison,
    toggleFavourite,
  };
}
