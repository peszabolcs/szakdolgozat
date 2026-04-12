import { rest } from 'msw';
import { parkingLocations } from '../data/parkingLocations';
import type { Area } from '../../types';

const mockAreas: Area[] = parkingLocations;

const MOCK_SCENARIO = import.meta.env.VITE_MOCK_SCENARIO || 'normal';

export const areasHandlers = [
  rest.get('/api/areas', (_req, res, ctx) => {
    if (MOCK_SCENARIO === 'error') {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Internal Server Error' })
      );
    }

    if (MOCK_SCENARIO === 'empty') {
      return res(ctx.status(200), ctx.json([]));
    }

    return res(ctx.delay(200), ctx.status(200), ctx.json(mockAreas));
  }),
];
