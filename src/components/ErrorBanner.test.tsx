import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBanner from './ErrorBanner';

describe('ErrorBanner', () => {
  it('renders error message', () => {
    render(<ErrorBanner message="Hiba történt" />);

    expect(screen.getByText('Hiba történt')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorBanner message="Hiba" onRetry={onRetry} />);

    expect(screen.getByRole('button', { name: /újrapróbálás/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorBanner message="Hiba" onRetry={onRetry} />);

    const retryButton = screen.getByRole('button', { name: /újrapróbálás/i });
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    const { container } = render(<ErrorBanner message="Hiba" />);

    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });
});
