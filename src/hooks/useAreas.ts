import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
