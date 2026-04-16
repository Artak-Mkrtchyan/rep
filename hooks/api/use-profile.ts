import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { AuthScope } from '@/lib/api/auth';
import {
  profileService,
  type IndividualBrokerProfile,
  type BrokerCompanyProfile,
  type UserProfile,
  type UsualUserUpdateRequest,
  type UpdateIndividualBrokerRequest,
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

export function useUserProfile(userId?: string) {
  return useQuery<UserProfile>({
    queryKey: [PROFILE_QUERY_KEY, 'user', userId],
    queryFn: () => profileService.getUser(userId!),
    enabled: !!userId,
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
  const { updateUserInfo } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UsualUserUpdateRequest }) =>
      profileService.updateUsualUser(id, data),
    onSuccess: (_response, variables) => {
      // Optimistically update local user info (fields tracked in AuthContext)
      const { fullName, phone } = variables.data;
      updateUserInfo({
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
      });

      // Invalidate the user profile query so DOB (and any other field
      // not tracked in AuthContext) is refetched
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY, 'user', variables.id] });
    },
  });
}

export function useUpdateIndividualBroker() {
  const { updateUserInfo } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIndividualBrokerRequest }) =>
      profileService.updateIndividualBroker(id, data),
    onSuccess: (response, variables) => {
      const { fullName, phoneNumber } = variables.data;
      updateUserInfo({
        ...(fullName !== undefined && { fullName }),
        ...(phoneNumber !== undefined && { phone: phoneNumber }),
      });

      queryClient.setQueryData(
        [PROFILE_QUERY_KEY, 'individual-broker', variables.id],
        response
      );
    },
  });
}
