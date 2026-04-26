import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders title and message', () => {
    render(
      <EmptyState
        title="Nincs adat"
        message="Nincsenek parkolóhelyek"
      />
    );

    expect(screen.getByText('Nincs adat')).toBeInTheDocument();
    expect(screen.getByText('Nincsenek parkolóhelyek')).toBeInTheDocument();
  });

  it('renders action button when provided and triggers callback', async () => {
    const onAction = vi.fn();
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <EmptyState
        title="Nincs adat"
        message="Teszt üzenet"
        actionLabel="Hozzáadás"
        onAction={onAction}
      />
    );

    const button = screen.getByRole('button', { name: /hozzáadás/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
    await user.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('does not render button when action is not provided', () => {
    render(<EmptyState title="Nincs adat" message="Teszt üzenet" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<EmptyState title="Nincs adat" message="Teszt üzenet" />);

    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-label', 'Nincs adat');
  });
});
