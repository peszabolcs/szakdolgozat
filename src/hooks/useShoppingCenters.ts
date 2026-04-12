import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ShoppingCenter } from '../types';

export const useShoppingCenters = () => {
  return useQuery({
    queryKey: ['shoppingCenters'],
    queryFn: async () => {
      const { data } = await axios.get<ShoppingCenter[]>('/api/shopping-centers');
      return data;
    },
  });
};
