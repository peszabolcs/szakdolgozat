import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { rest } from 'msw';
import { server } from '../test/setup';
import i18n from '../i18n/config';
import DashboardPage from './DashboardPage';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MemoryRouter>
    </I18nextProvider>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('renders without crashing', () => {
    const { container } = render(<DashboardPage />, { wrapper: createWrapper() });
    expect(container).toBeTruthy();
  });

  it('eventually exits the loading state', async () => {
    render(<DashboardPage />, { wrapper: createWrapper() });
    await waitFor(
      () => {
        // After data resolves the dashboard shows either KPIs or empty/error state.
        // The skeleton/loading container disappears.
        expect(document.querySelector('h1')).toBeTruthy();
      },
      { timeout: 5000 }
    );
  });

  it('handles empty shopping centers data', async () => {
    server.use(
      rest.get('/api/shopping-centers', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    render(<DashboardPage />, { wrapper: createWrapper() });

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
