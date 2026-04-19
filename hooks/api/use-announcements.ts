import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { announcementsService } from '@/lib/api/announcements';
import { Announcement } from '@/types/api';

const FETCH_PAGE_SIZE = 50;
const DISPLAY_COUNT = 9;

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

export interface UseFeaturedAnnouncementsResult {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFeaturedAnnouncements(): UseFeaturedAnnouncementsResult {
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const hasLoadedRef = useRef(false);

  const fetchAnnouncements = useCallback(async () => {
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await announcementsService.searchAnnouncements({
        filter: { statuses: ['ACTIVE'] },
        pagination: { pageNumber: 0, pageSize: FETCH_PAGE_SIZE },
        sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
      });
      if (mountedRef.current) {
        setAllAnnouncements(response.content);
        hasLoadedRef.current = true;
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load announcements');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchAnnouncements();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchAnnouncements]);

  const announcements = useMemo(
    () => getRandomSample(allAnnouncements, DISPLAY_COUNT),
    [allAnnouncements]
  );

  return { announcements, isLoading, error, refetch: fetchAnnouncements };
}
