import { rest } from 'msw';
import type { ParkingSpace } from '../../types';

// Mock data generator
const generateParkingSpaces = (count: number): ParkingSpace[] => {
  const areas = [
    { id: 'area-1', name: 'Zone A - Ground Floor' },
    { id: 'area-2', name: 'Zone B - Level 1' },
    { id: 'area-3', name: 'Zone C - Level 2' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const area = areas[i % areas.length];
    const isOccupied = Math.random() > 0.4; // 60% foglalt
    const minutesAgo = Math.floor(Math.random() * 60);

    return {
      id: `PS-${String(i + 1).padStart(3, '0')}`,
      status: isOccupied ? 'occupied' : 'free',
      areaId: area.id,
      areaName: area.name,
      updatedAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
    };
  });
};

// Scenarios: normal, empty, error
const MOCK_SCENARIO = import.meta.env.VITE_MOCK_SCENARIO || 'normal';

export const parkingSpacesHandlers = [
  rest.get('/api/parking-spaces', (_req, res, ctx) => {
    // Error scenario
    if (MOCK_SCENARIO === 'error') {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Internal Server Error' })
      );
    }

    // Empty scenario
    if (MOCK_SCENARIO === 'empty') {
      return res(ctx.status(200), ctx.json([]));
    }

    // Normal scenario
    const spaces = generateParkingSpaces(50);
    return res(ctx.delay(300), ctx.status(200), ctx.json(spaces));
  }),
];
