import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';

export interface ForecastPoint {
  hour: string;
  predictedOccupancy: number;
  predictedRatio: number;
  capacity: number;
  confidence: 'low' | 'medium' | 'high';
  sampleCount: number;
  minSeen: number;
  maxSeen: number;
}

export interface ForecastResponse {
  centerId: string;
  centerName: string;
  capacity: number;
  currentOccupancy: number;
  lookbackDays: number;
  hoursAhead: number;
  sampleSize: number;
  bestSlot: {
    hour: string;
    predictedOccupancy: number;
    predictedRatio: number;
    confidence: 'low' | 'medium' | 'high';
  } | null;
  points: ForecastPoint[];
  generatedAt: string;
}

export function useForecast(centerId: string | null | undefined, hoursAhead = 24) {
  return useQuery<ForecastResponse>({
    queryKey: ['forecast', centerId, hoursAhead],
    queryFn: async () => {
      const res = await apiClient.get<ForecastResponse>(`/api/forecast/${centerId}`, {
        params: { hoursAhead },
      });
      return res.data;
    },
    enabled: !!centerId,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
}
