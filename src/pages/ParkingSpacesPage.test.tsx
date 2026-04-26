import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import { server } from '../test/setup';
import i18n from '../i18n/config';
import ParkingSpacesPage from './ParkingSpacesPage';

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

describe('ParkingSpacesPage', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('renders title without crashing', () => {
    render(<ParkingSpacesPage />, { wrapper: createWrapper() });
    expect(screen.getAllByText(/Parking Spaces|Parkolóhelyek/i).length).toBeGreaterThan(0);
  });

  it('reaches a final state after the API resolves', async () => {
    render(<ParkingSpacesPage />, { wrapper: createWrapper() });
    await waitFor(
      () => {
        expect(document.querySelectorAll('h4').length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );
  });

  it('shows the empty state when no spaces are returned', async () => {
    server.use(
      rest.get('/api/parking-spaces', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    render(<ParkingSpacesPage />, { wrapper: createWrapper() });
    await waitFor(
      () => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
