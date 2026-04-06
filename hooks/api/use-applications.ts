import {
  AnnouncementPublicationListResponse,
  applicationsService,
  ApplicationStatusType,
} from '@/lib/api/applications';
import { ApiError } from '@/lib/api/auth.types';
import {
  ApplicationDetails,
  ApplicationStatisticsByStatusResponse,
  AssignBrokerRequest,
  BrokerCompany,
  IndividualBroker,
  SearchResponse,
} from '@/types/applications';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const APPLICATIONS_QUERY_KEY = 'applications';

const brokerListSorts = [
  {
    sort: 'CREATED_AT' as const,
    direction: 'DESC' as const,
  },
];

const getNextPageParam = (lastPage: SearchResponse<unknown>) => {
  if (lastPage.totalPages <= 0) return undefined;
  if (lastPage.pageNumber + 1 >= lastPage.totalPages) return undefined;
  return lastPage.pageNumber + 2;
};

// Hook for searching broker companies
export const useSearchBrokerCompanies = (
  params: { search?: string; page?: number; pageSize?: number } = {},
  enabled = true
) => {
  return useQuery<SearchResponse<BrokerCompany>, ApiError>({
    queryKey: [APPLICATIONS_QUERY_KEY, 'broker-companies', params],
    queryFn: () =>
      applicationsService.searchBrokerCompanies({
        filter: {
          ...(params.search && { nameContains: params.search }),
        },
        pagination: {
          pageNumber: (params.page || 1) - 1, // API uses 0-based indexing
          pageSize: params.pageSize || 10,
        },
        sorts: [
          {
            sort: 'CREATED_AT',
            direction: 'DESC',
          },
        ],
      }),
    enabled: enabled,
  });
};

// Hook for searching individual brokers
export const useSearchIndividualBrokers = (
  params: { search?: string; page?: number; pageSize?: number } = {},
  enabled = true
) => {
  return useQuery<SearchResponse<IndividualBroker>, ApiError>({
    queryKey: [APPLICATIONS_QUERY_KEY, 'individual-brokers', params],
    queryFn: () =>
      applicationsService.searchIndividualBrokers({
        filter: {
          ...(params.search && { fullNameContains: params.search }),
        },
        pagination: {
          pageNumber: (params.page || 1) - 1, // API uses 0-based indexing
          pageSize: params.pageSize || 10,
        },
        sorts: [
          {
            sort: 'CREATED_AT',
            direction: 'DESC',
          },
        ],
      }),
    enabled: enabled,
  });
};

export const useSearchIndividualBrokersInfinite = (
  search: string,
  pageSize: number,
  enabled: boolean
) => {
  return useInfiniteQuery<SearchResponse<IndividualBroker>, ApiError>({
    queryKey: [APPLICATIONS_QUERY_KEY, 'individual-brokers-infinite', search, pageSize],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      applicationsService.searchIndividualBrokers({
        filter: {
          ...(search.trim() && { fullNameContains: search.trim() }),
        },
        pagination: {
          pageNumber: (pageParam as number) - 1,
          pageSize,
        },
        sorts: brokerListSorts,
      }),
    getNextPageParam,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetMyApplicationsInfinite = (
  params: { filter?: ApplicationStatusType; pageSize?: number } = {},
  enabled = true
) => {
  return useInfiniteQuery<SearchResponse<AnnouncementPublicationListResponse>, ApiError>({
    queryKey: [APPLICATIONS_QUERY_KEY, 'my-applications', params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      applicationsService.getMyApplications({
        filter: {
          ...(params.filter && { statuses: [params.filter] }),
          types: ['ANNOUNCEMENT_PUBLICATION', 'ANNOUNCEMENT_MODIFICATION'],
        },
        pagination: {
          pageNumber: (pageParam as number) - 1, // API uses 0-based indexing
          pageSize: params.pageSize || 5,
        },
        sorts: [
          {
            sort: 'UPDATED_AT',
            direction: 'DESC',
          },
        ],
      }),
    getNextPageParam,
    enabled,
  });
};

export const useSearchBrokerCompaniesInfinite = (
  search: string,
  pageSize: number,
  enabled: boolean
) => {
  return useInfiniteQuery<SearchResponse<BrokerCompany>, ApiError>({
    queryKey: [APPLICATIONS_QUERY_KEY, 'broker-companies-infinite', search, pageSize],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      applicationsService.searchBrokerCompanies({
        filter: {
          ...(search.trim() && { nameContains: search.trim() }),
        },
        pagination: {
          pageNumber: (pageParam as number) - 1,
          pageSize,
        },
        sorts: brokerListSorts,
      }),
    getNextPageParam,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetIndividualBrokerById = (id: string, enabled = true) => {
  return useQuery<IndividualBroker, ApiError>({
    queryKey: [APPLICATIONS_QUERY_KEY, 'individual-broker', id],
    queryFn: () => applicationsService.getIndividualBrokerById(id),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetBrokerCompanyById = (id: string, enabled = true) => {
  return useQuery<BrokerCompany, ApiError>({
    queryKey: [APPLICATIONS_QUERY_KEY, 'broker-company', id],
    queryFn: () => applicationsService.getBrokerCompanyById(id),
    enabled: enabled && !!id,
  });
};

// Hook for assigning broker to application
export const useAssignBroker = () => {
  const queryClient = useQueryClient();

  return useMutation<ApplicationDetails, ApiError, { id: string; data: AssignBrokerRequest }>({
    mutationFn: ({ id, data }) => applicationsService.assignBroker(id, data),
    onSuccess: () => {
      // Invalidate and update queries
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Assign broker error:', error);
    },
  });
};

export const useGetApplicationStatisticsByStatuses = (enabled = true) => {
  return useQuery<ApplicationStatisticsByStatusResponse, ApiError>({
    queryKey: [APPLICATIONS_QUERY_KEY, 'statistics', 'by-statuses'],
    queryFn: () => applicationsService.getApplicationStatisticsByStatuses(),
    enabled,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
