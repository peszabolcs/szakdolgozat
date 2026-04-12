import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAreas } from './useAreas';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAreas', () => {
  it('fetches areas successfully', async () => {
    const { result } = renderHook(() => useAreas(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('returns correct area structure', async () => {
    const { result } = renderHook(() => useAreas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstArea = result.current.data?.[0];
    expect(firstArea).toHaveProperty('id');
    expect(firstArea).toHaveProperty('name');
    expect(firstArea).toHaveProperty('capacity');
    expect(firstArea).toHaveProperty('occupied');
  });
});
