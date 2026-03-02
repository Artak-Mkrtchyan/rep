import { useMemo } from 'react';

import { useAuth } from '@/context/AuthContext';
import { AuthScope } from '@/lib/api/auth';
import { decodeAccessToken } from '@/lib/jwt';

export interface UserClaims {
  email: string;
  scope: AuthScope;
  userId: string;
}

export function useUserClaims(): UserClaims | null {
  const { accessToken } = useAuth();

  return useMemo(() => {
    if (!accessToken) return null;

    const payload = decodeAccessToken(accessToken);
    if (!payload?.email || !payload?.scope) return null;

    return {
      email: payload.email,
      scope: payload.scope,
      userId: payload.sub,
    };
  }, [accessToken]);
}
