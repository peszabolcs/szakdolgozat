import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
} from '@mui/material';
import { useAreas } from '../hooks/useAreas';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { useTranslation } from 'react-i18next';

export default function AreasPage() {
  const { t } = useTranslation();
  const { data: areas, isLoading, isError, error, refetch } = useAreas();

  if (isLoading) {
    return <Typography>{t('common.loading')}</Typography>;
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

  if (!areas || areas.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('areas.title')}
        </Typography>
        <EmptyState
          title={t('areas.noAreasTitle')}
          message={t('areas.noAreasMessage')}
          actionLabel={t('areas.createArea')}
        />
      </Box>
    );
  }

  const getOccupancyColor = (rate: number) => {
    if (rate <= 50) return 'success';
    if (rate <= 80) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('areas.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {areas.length} {t('areas.totalAreas')}
      </Typography>

      <Grid container spacing={3}>
        {areas.map((area) => {
          const occupancyRate = Math.round((area.occupied / area.capacity) * 100);
          return (
            <Grid item xs={12} md={6} lg={4} key={area.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{area.name}</Typography>
                    <Chip
                      label={area.status === 'active' ? t('areas.active') : t('areas.inactive')}
                      color={area.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {area.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('areas.capacityLabel', { count: area.capacity })}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('areas.occupancyLabel', { occupied: area.occupied, capacity: area.capacity, rate: occupancyRate })}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={occupancyRate}
                    color={getOccupancyColor(occupancyRate)}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
