import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
  useReservations,
  useCreateReservation,
  useCancelReservation,
  reservationStorageKey,
  ReservationValidationError,
} from './useReservations';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function inTwoHours(): { start: string; end: string } {
  const start = new Date();
  start.setHours(start.getHours() + 2, 0, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

describe('useReservations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty list initially', async () => {
    const { result } = renderHook(() => useReservations(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it('creates a reservation in the future and persists it to localStorage', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateReservation(), { wrapper });
    const slot = inTwoHours();
    let created;
    await act(async () => {
      created = await result.current.mutateAsync({
        centerId: 'sc-1',
        centerName: 'Westend',
        slotStart: slot.start,
        slotEnd: slot.end,
      });
    });
    expect(created).toMatchObject({ centerId: 'sc-1', status: 'active' });

    const raw = localStorage.getItem(reservationStorageKey);
    expect(raw).toBeTruthy();
    const stored = JSON.parse(raw!);
    expect(stored).toHaveLength(1);
    expect(stored[0].centerId).toBe('sc-1');
  });

  it('rejects a reservation with a past time slot', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateReservation(), { wrapper });
    const past = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const end = new Date(Date.now() - 1000).toISOString();

    await expect(
      result.current.mutateAsync({
        centerId: 'sc-1',
        centerName: 'Westend',
        slotStart: past,
        slotEnd: end,
      })
    ).rejects.toBeInstanceOf(ReservationValidationError);
    expect(localStorage.getItem(reservationStorageKey)).toBeNull();
  });

  it('rejects a duplicate reservation for the same slot and center', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateReservation(), { wrapper });
    const slot = inTwoHours();
    await act(async () => {
      await result.current.mutateAsync({
        centerId: 'sc-2',
        centerName: 'Aréna',
        slotStart: slot.start,
        slotEnd: slot.end,
      });
    });

    let captured: unknown = null;
    await act(async () => {
      try {
        await result.current.mutateAsync({
          centerId: 'sc-2',
          centerName: 'Aréna',
          slotStart: slot.start,
          slotEnd: slot.end,
        });
      } catch (err) {
        captured = err;
      }
    });
    expect(captured).toBeInstanceOf(ReservationValidationError);
    expect((captured as ReservationValidationError).code).toBe('duplicate');
  });

  it('cancels an existing reservation', async () => {
    const wrapper = createWrapper();
    const { result: createResult } = renderHook(() => useCreateReservation(), { wrapper });
    const slot = inTwoHours();
    let created;
    await act(async () => {
      created = await createResult.current.mutateAsync({
        centerId: 'sc-3',
        centerName: 'Allee',
        slotStart: slot.start,
        slotEnd: slot.end,
      });
    });

    const { result: cancelResult } = renderHook(() => useCancelReservation(), { wrapper });
    await act(async () => {
      await cancelResult.current.mutateAsync(created!.id);
    });

    const stored = JSON.parse(localStorage.getItem(reservationStorageKey)!);
    expect(stored[0].status).toBe('cancelled');
  });
});
