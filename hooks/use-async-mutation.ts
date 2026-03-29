import { useCallback, useState } from 'react';

// Обобщенный хук для асинхронных операций
export const useAsyncMutation = <TResult, TError, TParams>(
  mutationFn: (params: TParams) => Promise<TResult>,
  onError?: (error: TError) => void
) => {
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<TError | null>(null);
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (params: TParams) => {
      setIsPending(true);
      setError(null);

      try {
        const result = await mutationFn(params);
        setData(result);
        return result;
      } catch (err) {
        const apiError = err as TError;
        setError(apiError);
        if (onError) onError(apiError);
        throw apiError;
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsPending(false);
  }, []);

  return {
    mutate,
    data,
    error,
    isPending,
    isError: !!error,
    isSuccess: !!data,
    reset,
  };
};
