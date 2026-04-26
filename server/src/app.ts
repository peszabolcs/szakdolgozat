import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import centersRoutes from './routes/shoppingCenters';
import spacesRoutes from './routes/parkingSpaces';
import areasRoutes from './routes/areas';
import reservationsRoutes from './routes/reservations';
import dashboardRoutes from './routes/dashboard';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/shopping-centers', centersRoutes);
  app.use('/api/parking-spaces', spacesRoutes);
  app.use('/api/areas', areasRoutes);
  app.use('/api/reservations', reservationsRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.use((_req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}
