import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { brokerEmployeesService } from '@/lib/api/broker-employees';
import type {
  BrokerEmployee,
  BrokerEmployeeFilter,
  CreateBrokerEmployeeRequest,
} from '@/types/brokers';
import type { SearchResponse } from '@/types/applications';

export const BROKER_EMPLOYEES_QUERY_KEY = 'broker-employees';

export function useSearchBrokerEmployees(
  companyId: string | undefined,
  page = 1,
  pageSize = 20,
  filter: BrokerEmployeeFilter = {}
) {
  return useQuery<SearchResponse<BrokerEmployee>, Error>({
    queryKey: [BROKER_EMPLOYEES_QUERY_KEY, companyId, page, pageSize, filter],
    queryFn: () =>
      brokerEmployeesService.searchEmployees({
        filter: {
          companyIds: companyId ? [companyId] : [],
          ...(filter.fullName ? { fullNameContains: filter.fullName } : {}),
          ...(filter.email ? { email: filter.email } : {}),
          ...(filter.positions?.length ? { positions: filter.positions } : {}),
          ...(filter.status?.length ? { statuses: filter.status } : {}),
          ...(filter.createdAt ? { createdAt: filter.createdAt } : {}),
        },
        pagination: {
          pageNumber: page - 1,
          pageSize,
        },
        sorts: [
          {
            sort: 'CREATED_AT',
            direction: 'DESC',
          },
        ],
      }),
    enabled: !!companyId,
  });
}

export function useCreateBrokerEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation<BrokerEmployee, Error, CreateBrokerEmployeeRequest>({
    mutationFn: (data) => brokerEmployeesService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BROKER_EMPLOYEES_QUERY_KEY] });
    },
  });
}
