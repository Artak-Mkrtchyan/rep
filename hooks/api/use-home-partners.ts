import { useMemo } from 'react';

import { applicationsService } from '@/lib/api/applications';
import type { BrokerCompany, IndividualBroker, SearchResponse } from '@/types/applications';
import { ApiError } from '@/lib/api/auth.types';
import { useQuery } from '@tanstack/react-query';

const HOME_PARTNERS_KEY = 'home-partners';
const FETCH_SIZE = 50;
const DISPLAY_COUNT = 8;

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomSample<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

export const useHomeBrokers = (displayCount = DISPLAY_COUNT) => {
  const query = useQuery<SearchResponse<IndividualBroker>, ApiError>({
    queryKey: [HOME_PARTNERS_KEY, 'brokers'],
    queryFn: () =>
      applicationsService.searchIndividualBrokers({
        filter: {},
        pagination: { pageNumber: 0, pageSize: FETCH_SIZE },
        sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
      }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const brokers = useMemo(() => {
    if (query.data?.content?.length) {
      return getRandomSample(query.data.content, displayCount);
    }
    return [];
  }, [query.data, displayCount]);

  return {
    brokers,
    isLoading: query.isLoading,
  };
};

export const useHomeConstructionCompanies = (displayCount = DISPLAY_COUNT) => {
  const query = useQuery<SearchResponse<BrokerCompany>, ApiError>({
    queryKey: [HOME_PARTNERS_KEY, 'construction-companies'],
    queryFn: () =>
      applicationsService.searchBrokerCompanies({
        filter: {},
        pagination: { pageNumber: 0, pageSize: FETCH_SIZE },
        sorts: [{ sort: 'CREATED_AT', direction: 'DESC' }],
      }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const companies = useMemo(() => {
    if (query.data?.content?.length) {
      return getRandomSample(query.data.content, displayCount);
    }
    return [];
  }, [query.data, displayCount]);

  return {
    companies,
    isLoading: query.isLoading,
  };
};
