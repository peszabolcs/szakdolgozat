import { Box, Typography, Grid } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PercentIcon from '@mui/icons-material/Percent';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { DashboardSkeleton } from '../components/skeletons';
import { useShoppingCenters } from '../hooks/useShoppingCenters';
import { useMemo } from 'react';
import { PageTransition } from '../components/PageTransition';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: centers, isLoading, isError, error, refetch } = useShoppingCenters();

  const stats = useMemo(() => {
    if (!centers || centers.length === 0) {
      return {
        totalCenters: 0,
        totalCapacity: 0,
        totalOccupied: 0,
        totalFree: 0,
        averageOccupancy: 0,
      };
    }

    const totalCapacity = centers.reduce((sum, center) => sum + center.capacity, 0);
    const totalOccupied = centers.reduce((sum, center) => sum + center.occupied, 0);
    const totalFree = totalCapacity - totalOccupied;
    const averageOccupancy =
      totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

    return {
      totalCenters: centers.length,
      totalCapacity,
      totalOccupied,
      totalFree,
      averageOccupancy,
    };
  }, [centers]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <ErrorBanner
        title={t('error.loadingFailed')}
        message={t('common.errorOccurred', {
          message: error instanceof Error ? error.message : t('common.unknownError'),
        })}
        onRetry={() => refetch()}
      />
    );
  }

  if (!centers || centers.length === 0) {
    return (
      <EmptyState
        title={t('dashboard.noCentersTitle')}
        message={t('dashboard.noCentersMessage')}
        actionLabel={t('reservation.empty.cta')}
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" gutterBottom component="h1" sx={{ fontWeight: 700 }}>
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('admin.subtitle')}
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }} role="region" aria-label={t('dashboard.statistics')}>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.totalCenters')}
              value={stats.totalCenters}
              icon={<StorefrontIcon />}
              accent="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.totalCapacity')}
              value={stats.totalCapacity.toLocaleString('hu-HU')}
              icon={<LocalParkingIcon />}
              accent="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.occupied')}
              value={stats.totalOccupied.toLocaleString('hu-HU')}
              icon={<CancelIcon />}
              accent="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.available')}
              value={stats.totalFree.toLocaleString('hu-HU')}
              icon={<CheckCircleIcon />}
              accent="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.averageOccupancy')}
              value={`${stats.averageOccupancy}%`}
              icon={<PercentIcon />}
              accent={stats.averageOccupancy >= 70 ? 'warning' : 'primary'}
            />
          </Grid>
        </Grid>
      </Box>
    </PageTransition>
  );
}
