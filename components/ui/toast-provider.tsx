import React from 'react';

import { ToastDescriptor, ToastHost, ToastVariant } from './toast';

type ShowToastArgs = {
  message: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastContextValue = {
  show: (args: ShowToastArgs) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastDescriptor | null>(null);

  const show = React.useCallback(({ message, description, variant = 'info', duration }: ShowToastArgs) => {
    setToast({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message,
      description,
      variant,
      duration,
    });
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToast((current) => (current?.id === id ? null : current));
  }, []);

  const value = React.useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message: string, description?: string) => show({ message, description, variant: 'success' }),
      error: (message: string, description?: string) => show({ message, description, variant: 'error' }),
      info: (message: string, description?: string) => show({ message, description, variant: 'info' }),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastHost toast={toast} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within a ToastProvider');
  return ctx;
}
