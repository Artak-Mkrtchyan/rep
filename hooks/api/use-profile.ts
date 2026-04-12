import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { AuthScope } from '@/lib/api/auth';
import {
  profileService,
  type IndividualBrokerProfile,
  type BrokerCompanyProfile,
  type UsualUserUpdateRequest,
} from '@/lib/api/profile';

export const PROFILE_QUERY_KEY = 'profile';

export function useIndividualBrokerProfile(brokerId?: string) {
  const { userInfo } = useAuth();
  const enabled = userInfo?.scope === AuthScope.BROKER && !!brokerId;

  return useQuery<IndividualBrokerProfile>({
    queryKey: [PROFILE_QUERY_KEY, 'individual-broker', brokerId],
    queryFn: () => profileService.getIndividualBroker(brokerId!),
    enabled,
  });
}

export function useBrokerCompanyProfile(companyId?: string) {
  const { userInfo } = useAuth();
  const enabled = userInfo?.scope === AuthScope.BROKER_COMPANY && !!companyId;

  return useQuery<BrokerCompanyProfile>({
    queryKey: [PROFILE_QUERY_KEY, 'broker-company', companyId],
    queryFn: () => profileService.getBrokerCompany(companyId!),
    enabled,
  });
}

export function useUpdateUsualUser() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UsualUserUpdateRequest }) =>
      profileService.updateUsualUser(id, data),
    onSuccess: () => {
      refreshUser();
    },
  });
}
