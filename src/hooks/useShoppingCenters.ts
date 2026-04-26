import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import type { ShoppingCenter } from '../types';

export const useShoppingCenters = () => {
  return useQuery({
    queryKey: ['shoppingCenters'],
    queryFn: async () => {
      const { data } = await apiClient.get<ShoppingCenter[]>('/api/shopping-centers');
      return data;
    },
  });
};

export const useShoppingCenter = (id: string | undefined) => {
  return useQuery({
    queryKey: ['shoppingCenter', id],
    queryFn: async () => {
      const { data } = await apiClient.get<ShoppingCenter>(`/api/shopping-centers/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useShoppingCenterHistory = (id: string | undefined) => {
  return useQuery({
    queryKey: ['shoppingCenterHistory', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Array<{ recordedAt: string; occupied: number; capacity: number }>>(
        `/api/shopping-centers/${id}/history`
      );
      return data;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
};
