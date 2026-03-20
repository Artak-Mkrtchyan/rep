import { useCallback, useEffect, useRef, useState } from 'react';

import { announcementsService } from '@/lib/api/announcements';
import type { Announcement } from '@/types/api';

export interface UseAnnouncementDetailsResult {
  announcement: Announcement | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  toggleFavourite: () => Promise<void>;
}

export function useAnnouncementDetails(id: string): UseAnnouncementDetailsResult {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await announcementsService.getAnnouncementById(id);
      if (mountedRef.current) {
        setAnnouncement(data);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load announcement');
        setAnnouncement(null);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [fetch]);

  const toggleFavourite = useCallback(async () => {
    if (!announcement) return;
    const wasFavourite = announcement.favourite;

    setAnnouncement((prev) => (prev ? { ...prev, favourite: !wasFavourite } : prev));

    try {
      if (wasFavourite) {
        await announcementsService.removeFromFavourites(announcement.id);
      } else {
        await announcementsService.addToFavourites(announcement.id);
      }
    } catch {
      setAnnouncement((prev) => (prev ? { ...prev, favourite: wasFavourite } : prev));
    }
  }, [announcement]);

  return { announcement, isLoading, error, refetch: fetch, toggleFavourite };
}
