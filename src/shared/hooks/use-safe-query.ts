
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { AlertCircle, Loader } from 'lucide-react';

interface UseSafeQueryOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError, TData>, 'onError'> {
  errorMessage?: string;
  showLoadingToast?: boolean;
}

export function useSafeQuery<TData, TError = Error>(
  options: UseSafeQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  const { toast } = useToast();
  const { errorMessage, showLoadingToast = false, ...queryOptions } = options;

  return useQuery<TData, TError, TData>({
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
    onSuccess: (data: TData) => {
      if (showLoadingToast) {
        toast({
          variant: "default",
          title: "Success",
          description: "Data loaded successfully!",
          className: "bg-green-50 border-green-200",
        });
      }
      if (queryOptions.onSuccess) {
        queryOptions.onSuccess(data);
      }
    },
    onSettled: (data: TData | undefined, error: TError | null) => {
      if (queryOptions.onSettled) {
        queryOptions.onSettled(data, error);
      }
    },
    onMutate: (variables: any) => {
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
