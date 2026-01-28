import { AuthScope } from '@/lib/api/auth';
import React from 'react';

type ForgotPasswordData = {
  email: string;
  scope: AuthScope;
};

type ForgotPasswordContextValue = {
  data: ForgotPasswordData;
  updateData: (updates: Partial<ForgotPasswordData>) => void;
  resetData: () => void;
};

const initialData: ForgotPasswordData = {
  email: '',
  scope: AuthScope.USUAL,
};

const ForgotPasswordContext = React.createContext<ForgotPasswordContextValue | undefined>(
  undefined
);

export function ForgotPasswordProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<ForgotPasswordData>(initialData);

  const updateData = React.useCallback((updates: Partial<ForgotPasswordData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetData = React.useCallback(() => {
    setData(initialData);
  }, []);

  const value = React.useMemo(
    () => ({
      data,
      updateData,
      resetData,
    }),
    [data, updateData, resetData]
  );

  return <ForgotPasswordContext.Provider value={value}>{children}</ForgotPasswordContext.Provider>;
}

export function useForgotPasswordContext(): ForgotPasswordContextValue {
  const ctx = React.useContext(ForgotPasswordContext);
  if (!ctx) {
    throw new Error('useForgotPasswordContext must be used within a ForgotPasswordProvider');
  }
  return ctx;
}
