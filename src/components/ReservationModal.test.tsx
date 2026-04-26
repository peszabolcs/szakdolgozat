import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import i18n from '../i18n/config';
import ReservationModal from './ReservationModal';
import type { ShoppingCenter } from '../types';
import { reservationStorageKey } from '../hooks/useReservations';

const centers: ShoppingCenter[] = [
  {
    id: 'sc-1',
    name: 'Westend',
    address: 'Budapest, Váci út 1-3',
    location: { lat: 47.5, lng: 19.05 },
    capacity: 800,
    occupied: 400,
    openingHours: '10:00 - 22:00',
    description: 'Test',
  },
  {
    id: 'sc-2',
    name: 'Allee (telített)',
    address: 'Budapest',
    location: { lat: 47.5, lng: 19.05 },
    capacity: 100,
    occupied: 100,
    openingHours: '10:00 - 22:00',
    description: 'Full',
  },
];

function renderModal(preselectedCenterId?: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>
        <SnackbarProvider>
          <ReservationModal
            open
            onClose={() => undefined}
            centers={centers}
            preselectedCenterId={preselectedCenterId}
          />
        </SnackbarProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

describe('ReservationModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the modal with title and confirm button', () => {
    renderModal('sc-1');
    expect(screen.getByText(/Parkolóhely foglalása|Reserve a parking spot/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Foglalás megerősítése|Confirm reservation/ })).toBeInTheDocument();
  });

  it('disables the confirm button when no time slot is selected', () => {
    renderModal('sc-1');
    const confirm = screen.getByRole('button', { name: /Foglalás megerősítése|Confirm reservation/ });
    expect(confirm).toBeDisabled();
  });

  it('disables the confirm button when the center is fully occupied', async () => {
    renderModal('sc-2');
    expect(
      screen.getByRole('button', { name: /Foglalás megerősítése|Confirm reservation/ })
    ).toBeDisabled();
  });

  it('renders all hour slot chips', async () => {
    renderModal('sc-1');
    // 14 időslot 8:00 - 21:00 között.
    const slots = await screen.findAllByText(/^\d{2}:00$/);
    expect(slots.length).toBeGreaterThanOrEqual(14);
  });

  it('does not write to localStorage before confirmation', () => {
    renderModal('sc-1');
    expect(localStorage.getItem(reservationStorageKey)).toBeNull();
  });
});
