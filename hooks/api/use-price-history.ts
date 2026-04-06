import { useCallback, useEffect, useRef, useState } from 'react';

import { announcementsService } from '@/lib/api/announcements';
import { PriceChangeHistory } from '@/types/api';

export interface UsePriceHistoryResult {
  priceHistory: PriceChangeHistory[];
  isLoading: boolean;
  error: string | null;
}

export function usePriceHistory(announcementId: string): UsePriceHistoryResult {
  const [priceHistory, setPriceHistory] = useState<PriceChangeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await announcementsService.getAnnouncementsHistory({
        filter: {
          announcementId,
          types: ['announcement-price-changed'],
        },
        pagination: { pageNumber: 0, pageSize: 5 },
        sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
      });
      if (mountedRef.current) {
        setPriceHistory(response.content);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load price history');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [announcementId]);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [fetch]);

  return { priceHistory, isLoading, error };
}
