
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useToast } from './use-toast';

export function useSafeQuery<TData, TError = Error>(
  options: Omit<UseQueryOptions<TData, TError>, 'onError'> & {
    errorMessage?: string;
  }
): UseQueryResult<TData, TError> {
  const { toast } = useToast();
  const { errorMessage, ...queryOptions } = options;

  return useQuery<TData, TError>({
    ...queryOptions,
    retry: false,
    meta: {
      ...queryOptions.meta,
      onError: (error: TError) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage || (error instanceof Error ? error.message : 'An error occurred'),
        });
      },
    },
  });
}

