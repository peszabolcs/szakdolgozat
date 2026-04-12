import { rest } from 'msw';
import { shoppingCenters } from '../data/shoppingCenters';

export const shoppingCenterHandlers = [
  rest.get('/api/shopping-centers', (_req, res, ctx) => {
    const scenario = import.meta.env.VITE_MOCK_SCENARIO || 'normal';

    if (scenario === 'error') {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Internal Server Error' })
      );
    }

    if (scenario === 'empty') {
      return res(ctx.status(200), ctx.json([]));
    }

    return res(ctx.status(200), ctx.json(shoppingCenters));
  }),

  rest.get('/api/shopping-centers/:id', (req, res, ctx) => {
    const { id } = req.params;
    const center = shoppingCenters.find((c) => c.id === id);

    if (!center) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Shopping center not found' })
      );
    }

    return res(ctx.status(200), ctx.json(center));
  }),
];
