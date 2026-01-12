import React, { createContext, useContext, useState } from 'react';

import type { AccountRole, BrokerSignUpForm } from '@/types/auth';

interface SignUpData {
  role?: AccountRole;
  email?: string;
  otp?: string;
  password?: string;
  brokerDetails?: Partial<BrokerSignUpForm>;
}

interface SignUpContextType {
  data: SignUpData;
  updateData: (newData: Partial<SignUpData>) => void;
  resetData: () => void;
}

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export function SignUpProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SignUpData>({});

  const updateData = (newData: Partial<SignUpData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setData({});
  };

  return (
    <SignUpContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </SignUpContext.Provider>
  );
}

export function useSignUpContext() {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error('useSignUpContext must be used within a SignUpProvider');
  }
  return context;
}
