import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ParkingSpace } from '../types';

export const useParkingSpaces = () => {
  return useQuery({
    queryKey: ['parkingSpaces'],
    queryFn: async () => {
      const { data } = await axios.get<ParkingSpace[]>('/api/parking-spaces');
      return data;
    },
  });
};
