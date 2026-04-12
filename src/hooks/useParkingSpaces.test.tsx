import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParkingSpaces } from './useParkingSpaces';
import { ReactNode } from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useParkingSpaces', () => {
  it('fetches parking spaces successfully', async () => {
    const { result } = renderHook(() => useParkingSpaces(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('returns parking spaces with correct structure', async () => {
    const { result } = renderHook(() => useParkingSpaces(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstSpace = result.current.data?.[0];
    expect(firstSpace).toHaveProperty('id');
    expect(firstSpace).toHaveProperty('status');
    expect(firstSpace).toHaveProperty('areaId');
    expect(firstSpace).toHaveProperty('areaName');
    expect(firstSpace).toHaveProperty('updatedAt');
  });
});
