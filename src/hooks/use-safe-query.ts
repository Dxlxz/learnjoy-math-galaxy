
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { AlertCircle, Loader } from 'lucide-react';

export function useSafeQuery<TData, TError = Error>(
  options: Omit<UseQueryOptions<TData, TError>, 'onError'> & {
    errorMessage?: string;
    showLoadingToast?: boolean;
  }
): UseQueryResult<TData, TError> {
  const { toast } = useToast();
  const { errorMessage, showLoadingToast = false, ...queryOptions } = options;

  return useQuery<TData, TError>({
    ...queryOptions,
    retry: false,
    meta: {
      ...queryOptions.meta,
      onError: (error: TError) => {
        console.error('Query error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage || (error instanceof Error ? error.message : 'An error occurred'),
          icon: <AlertCircle className="h-4 w-4" />
        });
        if (queryOptions.meta?.onError) {
          queryOptions.meta.onError(error);
        }
      }
    },
    onSuccess: (data) => {
      if (queryOptions.onSuccess) {
        queryOptions.onSuccess(data);
      }
    },
    onSettled: (data, error) => {
      if (queryOptions.onSettled) {
        queryOptions.onSettled(data, error);
      }
    },
    onMutate: (variables) => {
      if (showLoadingToast) {
        toast({
          title: "Loading",
          description: "Please wait while we fetch your data...",
          icon: <Loader className="h-4 w-4 animate-spin" />
        });
      }
      if (queryOptions.onMutate) {
        return queryOptions.onMutate(variables);
      }
    }
  });
}
