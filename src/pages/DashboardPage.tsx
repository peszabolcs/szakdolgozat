import { Box, Typography, Grid, Alert } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PercentIcon from '@mui/icons-material/Percent';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { useShoppingCenters } from '../hooks/useShoppingCenters';
import { useMemo } from 'react';
import { PageTransition } from '../components/PageTransition';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: centers, isLoading, isError, error, refetch } = useShoppingCenters();

  const stats = useMemo(() => {
    if (!centers || centers.length === 0) {
      return {
        totalCenters: 0,
        totalCapacity: 0,
        totalOccupied: 0,
        totalFree: 0,
        averageOccupancy: 0
      };
    }

    const totalCapacity = centers.reduce((sum, center) => sum + center.capacity, 0);
    const totalOccupied = centers.reduce((sum, center) => sum + center.occupied, 0);
    const totalFree = totalCapacity - totalOccupied;
    const averageOccupancy = totalCapacity > 0
      ? Math.round((totalOccupied / totalCapacity) * 100)
      : 0;

    return {
      totalCenters: centers.length,
      totalCapacity,
      totalOccupied,
      totalFree,
      averageOccupancy,
    };
  }, [centers]);

  if (isLoading) {
    return <Typography role="status" aria-live="polite">{t('common.loading')}</Typography>;
  }

  if (isError) {
    return (
      <ErrorBanner
        message={t('common.errorOccurred', {
          message: error instanceof Error ? error.message : t('common.unknownError')
        })}
        onRetry={() => refetch()}
      />
    );
  }

  if (!centers || centers.length === 0) {
    return (
      <>
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('dashboard.noCentersYet')}
        </Alert>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.totalCenters')}
              value={0}
              icon={<StorefrontIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.totalCapacity')}
              value={0}
              icon={<LocalParkingIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.occupied')}
              value={0}
              icon={<CancelIcon />}
              color="#ef4444"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('dashboard.available')}
              value={0}
              icon={<CheckCircleIcon />}
              color="#00897b"
            />
          </Grid>
        </Grid>
        <EmptyState
          title={t('dashboard.noCentersTitle')}
          message={t('dashboard.noCentersMessage')}
        />
      </>
    );
  }

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" gutterBottom component="h1">
          {t('dashboard.title')}
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }} role="region" aria-label={t('dashboard.statistics')}>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.totalCenters')}
              value={stats.totalCenters}
              icon={<StorefrontIcon />}
              color="#26636f"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.totalCapacity')}
              value={stats.totalCapacity}
              icon={<LocalParkingIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.occupied')}
              value={stats.totalOccupied}
              icon={<CancelIcon />}
              color="#ef4444"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.available')}
              value={stats.totalFree}
              icon={<CheckCircleIcon />}
              color="#00897b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title={t('dashboard.averageOccupancy')}
              value={`${stats.averageOccupancy}%`}
              icon={<PercentIcon />}
            />
          </Grid>
        </Grid>
      </Box>
    </PageTransition>
  );
}
