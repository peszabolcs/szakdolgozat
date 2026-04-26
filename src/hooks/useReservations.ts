import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Reservation } from '../types';

const STORAGE_KEY = 'parkvision.reservations.v1';
const QUERY_KEY = ['reservations'];

function readAll(): Reservation[] {
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

function writeAll(reservations: Reservation[]): void {
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
  code: 'past' | 'duplicate';
  constructor(code: 'past' | 'duplicate', message: string) {
    super(message);
    this.code = code;
    this.name = 'ReservationValidationError';
  }
}

export const useReservations = () => {
  return useQuery<Reservation[]>({
    queryKey: QUERY_KEY,
    queryFn: () => Promise.resolve(readAll()),
    staleTime: Infinity,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReservationInput) => {
      const start = new Date(input.slotStart).getTime();
      if (Number.isNaN(start) || start <= Date.now()) {
        throw new ReservationValidationError('past', 'A választott időslot a múltban van.');
      }
      const existing = readAll();
      const duplicate = existing.some(
        (r) =>
          r.status === 'active' &&
          r.centerId === input.centerId &&
          r.slotStart === input.slotStart
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
      writeAll([reservation, ...existing]);
      return reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const all = readAll();
      const updated = all.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r));
      writeAll(updated);
      return updated.find((r) => r.id === id) ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const reservationStorageKey = STORAGE_KEY;
