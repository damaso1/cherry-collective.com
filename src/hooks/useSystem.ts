import { useQuery } from '@tanstack/react-query';
import { systemApi } from '../lib/api';

export const useSystemStatus = () => {
  return useQuery({
    queryKey: ['system', 'status'],
    queryFn: systemApi.getStatus,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: systemApi.getHealth,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const useMetrics = () => {
  return useQuery({
    queryKey: ['system', 'metrics'],
    queryFn: systemApi.getMetrics,
    refetchInterval: 60000, // Refetch every minute
  });
};
