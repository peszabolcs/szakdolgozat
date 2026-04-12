import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { server } from '../test/setup';
import AreasPage from './AreasPage';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('AreasPage', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('renders loading state initially', () => {
    render(<AreasPage />, { wrapper: createWrapper() });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders content after data loads', async () => {
    render(<AreasPage />, { wrapper: createWrapper() });

    await waitFor(
      () => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('handles empty areas', async () => {
    server.use(
      rest.get('/api/areas', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    render(<AreasPage />, { wrapper: createWrapper() });

    await waitFor(
      () => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
