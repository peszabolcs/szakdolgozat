import express from 'express';
import cors, { type CorsOptions } from 'cors';
import authRoutes from './routes/auth';
import centersRoutes from './routes/shoppingCenters';
import spacesRoutes from './routes/parkingSpaces';
import areasRoutes from './routes/areas';
import reservationsRoutes from './routes/reservations';
import dashboardRoutes from './routes/dashboard';
import forecastRoutes from './routes/forecast';
import streamRoutes from './routes/stream';
import reportsRoutes from './routes/reports';

function buildCorsOptions(): CorsOptions {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CORS_ORIGIN env var is required in production');
    }
    return { origin: true, credentials: true };
  }
  const allowlist = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return {
    origin(origin, callback) {
      if (!origin || allowlist.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  };
}

export function createApp() {
  const app = express();
  app.use(cors(buildCorsOptions()));
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
  app.use('/api/forecast', forecastRoutes);
  app.use('/api/stream', streamRoutes);
  app.use('/api/reports', reportsRoutes);

  app.use((_req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}
