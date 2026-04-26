import { useQuery } from '@tanstack/react-query';
import { apiClient as axios } from '../utils/apiClient';
import type { Area } from '../types';

export const useAreas = () => {
  return useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const { data } = await axios.get<Area[]>('/api/areas');
      return data;
    },
  });
};
