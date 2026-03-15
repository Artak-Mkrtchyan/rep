import { useCallback, useEffect, useRef, useState } from 'react';

import { announcementsService } from '@/lib/api/announcements';
import { Announcement } from '@/types/api';

export interface UseFeaturedAnnouncementsResult {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFeaturedAnnouncements(pageSize = 5): UseFeaturedAnnouncementsResult {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const hasLoadedRef = useRef(false);

  const fetch = useCallback(async () => {
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await announcementsService.searchAnnouncements({
        pagination: { pageNumber: 0, pageSize },
        sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
      });
      if (mountedRef.current) {
        setAnnouncements(response.content);
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
  }, [pageSize]);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [fetch]);

  return { announcements, isLoading, error, refetch: fetch };
}
