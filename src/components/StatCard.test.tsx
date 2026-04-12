import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Összes hely" value={100} />);

    expect(screen.getByText('Összes hely')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with string value', () => {
    render(<StatCard title="Foglaltság" value="60%" />);

    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <StatCard
        title="Összes"
        value={50}
        icon={<LocalParkingIcon data-testid="parking-icon" />}
      />
    );

    expect(screen.getByTestId('parking-icon')).toBeInTheDocument();
  });
});
