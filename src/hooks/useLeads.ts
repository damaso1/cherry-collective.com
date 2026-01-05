import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../lib/api';

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => leadsApi.getById(id),
    enabled: !!id,
  });
};

export const useRunTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ botId, taskCategory }: { botId: string; taskCategory: string }) =>
      leadsApi.runTask(botId, taskCategory),
    onSuccess: () => {
      // Invalidate leads query to refetch
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
