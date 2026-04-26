import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Grid,
  Divider,
  LinearProgress,
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useShoppingCenter, useShoppingCenterHistory } from '../hooks/useShoppingCenters';
import { useShoppingCenters } from '../hooks/useShoppingCenters';
import ReservationModal from '../components/ReservationModal';
import ErrorBanner from '../components/ErrorBanner';
import { CardGridSkeleton } from '../components/skeletons';

export default function ParkingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const center = useShoppingCenter(id);
  const history = useShoppingCenterHistory(id);
  const allCenters = useShoppingCenters();
  const [reservationOpen, setReservationOpen] = useState(false);

  const heatmap = useMemo(() => {
    if (!history.data) return null;
    const grid: Array<Array<{ ratio: number; count: number }>> = Array.from({ length: 7 }, () =>
      Array.from({ length: 24 }, () => ({ ratio: 0, count: 0 }))
    );
    for (const point of history.data) {
      const date = new Date(point.recordedAt);
      const day = (date.getDay() + 6) % 7; // Monday = 0
      const hour = date.getHours();
      const ratio = point.capacity > 0 ? point.occupied / point.capacity : 0;
      grid[day][hour].ratio += ratio;
      grid[day][hour].count += 1;
    }
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        if (grid[d][h].count > 0) grid[d][h].ratio /= grid[d][h].count;
      }
    }
    return grid;
  }, [history.data]);

  const trendData = useMemo(() => {
    if (!history.data) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = today.getTime();
    const todayPoints = history.data.filter((p) => new Date(p.recordedAt).getTime() >= start);
    return todayPoints.map((p) => ({
      time: new Date(p.recordedAt).getHours().toString().padStart(2, '0') + ':00',
      occupancy: p.capacity > 0 ? Math.round((p.occupied / p.capacity) * 100) : 0,
    }));
  }, [history.data]);

  if (center.isLoading) {
    return (
      <Box>
        <CardGridSkeleton count={3} columns={{ md: 1 }} />
      </Box>
    );
  }
  if (center.isError || !center.data) {
    return (
      <ErrorBanner
        title={t('error.loadingFailed')}
        message={(center.error as Error)?.message ?? t('common.unknownError')}
        onRetry={() => center.refetch()}
      />
    );
  }

  const c = center.data;
  const occupancyRate = (c.occupied / c.capacity) * 100;
  const occupancyColor: 'success' | 'warning' | 'error' =
    occupancyRate >= 90 ? 'error' : occupancyRate >= 70 ? 'warning' : 'success';

  const days = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/admin/shopping-centers" sx={{ mb: 2 }}>
        {t('common.back', 'Vissza')}
      </Button>

      <Box
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          mb: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
          color: 'white',
          p: { xs: 3, md: 5 },
          position: 'relative',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ md: 'flex-end' }}>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.85, fontWeight: 700 }}>
              {t('parkingDetail.eyebrow')}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
              {c.name}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1.5, opacity: 0.9 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">{c.address}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ScheduleIcon fontSize="small" />
                <Typography variant="body2">{c.openingHours}</Typography>
              </Stack>
            </Stack>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<EventAvailableIcon />}
            onClick={() => setReservationOpen(true)}
            disabled={occupancyRate >= 100}
            sx={{ alignSelf: { xs: 'stretch', md: 'flex-end' } }}
          >
            {t('reservation.cta')}
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                {t('parkingDetail.kpiOccupancy')}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: `${occupancyColor}.main` }}>
                {occupancyRate.toFixed(0)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, occupancyRate)}
                color={occupancyColor}
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                {t('parkingDetail.kpiFree')}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                {c.capacity - c.occupied}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                / {c.capacity} {t('parkingDetail.totalCapacity')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                {t('parkingDetail.kpiStatus')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
                <Chip
                  label={t(`parkingDetail.statusLabel.${occupancyColor}`)}
                  color={occupancyColor}
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {new Date(c.updatedAt ?? Date.now()).toLocaleString(i18n.language)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {t('parkingDetail.todayTrend')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {trendData.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('parkingDetail.noTrendData')}
            </Typography>
          ) : (
            <Box sx={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#26636f" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#26636f" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="time" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Area type="monotone" dataKey="occupancy" stroke="#26636f" strokeWidth={2} fill="url(#trendGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {t('parkingDetail.weeklyHeatmap')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('parkingDetail.heatmapHint')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {!heatmap ? (
            <Typography variant="body2" color="text.secondary">
              {t('parkingDetail.noTrendData')}
            </Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ display: 'inline-grid', gridTemplateColumns: `auto repeat(24, 22px)`, gap: '2px', minWidth: 700 }}>
                <Box />
                {Array.from({ length: 24 }).map((_, h) => (
                  <Typography key={h} variant="caption" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.65rem' }}>
                    {h}
                  </Typography>
                ))}
                {heatmap.map((row, d) => (
                  <Box key={d} sx={{ display: 'contents' }}>
                    <Typography variant="caption" sx={{ pr: 1, alignSelf: 'center', color: 'text.secondary' }}>
                      {days[d]}
                    </Typography>
                    {row.map((cell, h) => (
                      <Box
                        key={h}
                        title={`${days[d]} ${h}:00 — ${(cell.ratio * 100).toFixed(0)}%`}
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: 0.5,
                          bgcolor: (theme) =>
                            cell.count === 0
                              ? theme.palette.action.disabledBackground
                              : `rgba(${cell.ratio > 0.85 ? '239,68,68' : cell.ratio > 0.6 ? '249,168,37' : cell.ratio > 0.3 ? '38,99,111' : '0,137,123'}, ${0.15 + cell.ratio * 0.75})`,
                        }}
                      />
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {allCenters.data && (
        <ReservationModal
          open={reservationOpen}
          onClose={() => setReservationOpen(false)}
          centers={allCenters.data}
          preselectedCenterId={id}
        />
      )}
      {!allCenters.data && reservationOpen && (
        <Button onClick={() => navigate('/')}>← Foglalási flow a publikus oldalon</Button>
      )}
    </Box>
  );
}
