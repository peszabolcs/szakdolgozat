import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/useAuth';
import { apiClient } from '../utils/apiClient';
import type { Reservation } from '../types';

const STORAGE_KEY = 'parkvision.reservations.v1';
const QUERY_KEY = ['reservations'];

function readLocal(): Reservation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(reservations: Reservation[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `res_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export interface CreateReservationInput {
  centerId: string;
  centerName: string;
  slotStart: string;
  slotEnd: string;
}

export class ReservationValidationError extends Error {
  code: 'past' | 'duplicate' | 'full';
  constructor(code: 'past' | 'duplicate' | 'full', message: string) {
    super(message);
    this.code = code;
    this.name = 'ReservationValidationError';
  }
}

export const useReservations = () => {
  const { isAuthenticated } = useAuth();
  return useQuery<Reservation[]>({
    queryKey: [...QUERY_KEY, isAuthenticated ? 'remote' : 'local'],
    queryFn: async () => {
      if (isAuthenticated) {
        const { data } = await apiClient.get<Reservation[]>('/api/reservations');
        return data;
      }
      return readLocal();
    },
    staleTime: 30_000,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  return useMutation({
    mutationFn: async (input: CreateReservationInput): Promise<Reservation> => {
      const start = new Date(input.slotStart).getTime();
      if (Number.isNaN(start) || start <= Date.now()) {
        throw new ReservationValidationError('past', 'A választott időslot a múltban van.');
      }

      if (isAuthenticated) {
        try {
          const { data } = await apiClient.post<Reservation>('/api/reservations', {
            centerId: input.centerId,
            slotStart: input.slotStart,
            slotEnd: input.slotEnd,
          });
          return data;
        } catch (err) {
          const error = err as { response?: { status?: number; data?: { code?: string; message?: string } } };
          const code = error.response?.data?.code;
          if (code === 'past' || code === 'duplicate' || code === 'full') {
            const message = error.response?.data?.message ?? 'Foglalás visszautasítva';
            throw new ReservationValidationError(code, message);
          }
          throw err;
        }
      }

      const existing = readLocal();
      const duplicate = existing.some(
        (r) => r.status === 'active' && r.centerId === input.centerId && r.slotStart === input.slotStart
      );
      if (duplicate) {
        throw new ReservationValidationError(
          'duplicate',
          'Erre az időslotra már van foglalásod ebben a központban.'
        );
      }
      const reservation: Reservation = {
        id: generateId(),
        centerId: input.centerId,
        centerName: input.centerName,
        slotStart: input.slotStart,
        slotEnd: input.slotEnd,
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      writeLocal([reservation, ...existing]);
      return reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  return useMutation({
    mutationFn: async (id: string): Promise<Reservation | null> => {
      if (isAuthenticated) {
        const { data } = await apiClient.delete<Reservation>(`/api/reservations/${id}`);
        return data;
      }
      const all = readLocal();
      const updated = all.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r));
      writeLocal(updated);
      return updated.find((r) => r.id === id) ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const reservationStorageKey = STORAGE_KEY;
