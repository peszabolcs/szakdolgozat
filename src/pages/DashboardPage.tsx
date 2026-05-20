import { Box, Typography, Grid, Stack, LinearProgress, alpha } from '@mui/material';
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
import { useOccupancyStream } from '../hooks/useOccupancyStream';
import { useMemo } from 'react';
import { PageTransition } from '../components/PageTransition';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: centers, isLoading, isError, error, refetch } = useShoppingCenters();
  const stream = useOccupancyStream(true);

  const stats = useMemo(() => {
    if (!centers || centers.length === 0) {
      return { totalCenters: 0, totalCapacity: 0, totalOccupied: 0, totalFree: 0, averageOccupancy: 0 };
    }
    const totalCapacity = centers.reduce((sum, c) => sum + c.capacity, 0);
    const totalOccupied = centers.reduce((sum, c) => sum + c.occupied, 0);
    const totalFree = totalCapacity - totalOccupied;
    const averageOccupancy = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
    return { totalCenters: centers.length, totalCapacity, totalOccupied, totalFree, averageOccupancy };
  }, [centers]);

  const rankedCenters = useMemo(() => {
    if (!centers) return [];
    return [...centers]
      .map((c) => ({ ...c, ratio: c.capacity > 0 ? c.occupied / c.capacity : 0 }))
      .sort((a, b) => b.ratio - a.ratio);
  }, [centers]);

  if (isLoading) return <DashboardSkeleton />;
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

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return (
    <PageTransition>
      <Box className="pv-reveal pv-reveal-1">
        {/* Section header — editorial */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 1 }}
        >
          <Box>
            <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
              № A·01 · Vezérlőpult · {timeStr}
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 400,
                fontSize: { xs: '2.25rem', md: '3.25rem' },
                lineHeight: 1.05,
                letterSpacing: '-0.024em',
                color: 'text.primary',
              }}
            >
              Most, <Box component="span" sx={{ fontStyle: 'italic' }}>élőben</Box>.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 540 }}>
              Aggregált foglaltsági mutatók, 30 másodpercenként frissülő IoT-stream alapján.
            </Typography>
          </Box>

          {/* Live indicator — editorial pill */}
          <Box
            sx={(theme) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              border: `1px solid ${stream.connected ? '#4d7c0f' : alpha(theme.palette.text.primary, 0.24)}`,
              borderRadius: 999,
              backgroundColor: stream.connected
                ? alpha('#4d7c0f', 0.08)
                : alpha(theme.palette.text.primary, 0.04),
            })}
          >
            <Box
              className={stream.connected ? 'pv-pulse' : undefined}
              sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stream.connected ? '#4d7c0f' : 'text.disabled' }}
            />
            <Typography
              className="pv-mono"
              sx={{
                fontSize: '0.6875rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: stream.connected ? '#3f6212' : 'text.disabled',
              }}
            >
              {stream.connected ? 'Élő adatfolyam' : 'Offline · auto-újra'}
            </Typography>
          </Box>
        </Stack>

        <Box className="pv-rule-saffron" sx={{ mt: 3, mb: 4 }} />

        {/* === KPI strip === */}
        <Grid container spacing={2.5} sx={{ mb: 6 }} role="region" aria-label={t('dashboard.statistics')}>
          <Grid item xs={6} sm={4} md={2.4} className="pv-reveal pv-reveal-1">
            <StatCard
              title="Központok"
              monoLabel="A·01"
              value={String(stats.totalCenters).padStart(2, '0')}
              icon={<StorefrontIcon />}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2.4} className="pv-reveal pv-reveal-2">
            <StatCard
              title="Kapacitás"
              monoLabel="A·02"
              value={stats.totalCapacity.toLocaleString('hu-HU')}
              unit="férőhely"
              icon={<LocalParkingIcon />}
              accent="secondary"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2.4} className="pv-reveal pv-reveal-3">
            <StatCard
              title="Foglalt"
              monoLabel="A·03"
              value={stats.totalOccupied.toLocaleString('hu-HU')}
              icon={<CancelIcon />}
              accent="error"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2.4} className="pv-reveal pv-reveal-4">
            <StatCard
              title="Szabad"
              monoLabel="A·04"
              value={stats.totalFree.toLocaleString('hu-HU')}
              icon={<CheckCircleIcon />}
              accent="success"
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2.4} className="pv-reveal pv-reveal-5">
            <StatCard
              title="Átlag"
              monoLabel="A·05"
              value={stats.averageOccupancy.toString()}
              unit="%"
              icon={<PercentIcon />}
              accent={stats.averageOccupancy >= 70 ? 'warning' : 'primary'}
            />
          </Grid>
        </Grid>

        {/* === Section break === */}
        <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 2.5 }}>
          <Box>
            <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
              № A·02 · Rangsor
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 500,
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.022em',
                color: 'text.primary',
              }}
            >
              A legforgalmasabb központok.
            </Typography>
          </Box>
        </Stack>

        {/* Center ranking — editorial */}
        <Box
          sx={(theme) => ({
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            backgroundColor: 'background.paper',
            overflow: 'hidden',
          })}
        >
          <Box
            sx={(theme) => ({
              display: 'grid',
              gridTemplateColumns: '32px 1fr 120px 1fr 110px',
              alignItems: 'baseline',
              gap: 2,
              px: 2.5,
              py: 1.25,
              borderBottom: `2px solid ${theme.palette.text.primary}`,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.6875rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              fontWeight: 500,
            })}
          >
            <span>#</span>
            <span>Központ</span>
            <span style={{ textAlign: 'right' }}>Foglalt / Kapacitás</span>
            <span>Kihasználtság</span>
            <span style={{ textAlign: 'right' }}>%</span>
          </Box>

          {rankedCenters.map((c, idx) => {
            const pct = Math.round(c.ratio * 100);
            const band = pct >= 85 ? '#991b1b' : pct >= 60 ? '#b45309' : '#4d7c0f';
            return (
              <Box
                key={c.id}
                onClick={() => navigate(`/admin/centers/${c.id}`)}
                sx={(theme) => ({
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr 120px 1fr 110px',
                  alignItems: 'center',
                  gap: 2,
                  px: 2.5,
                  py: 1.75,
                  borderBottom: idx === rankedCenters.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`,
                  cursor: 'pointer',
                  transition: 'background-color 200ms ease',
                  '&:hover': { backgroundColor: alpha(theme.palette.text.primary, 0.03) },
                })}
              >
                <Typography
                  className="pv-mono"
                  sx={{ fontSize: '0.875rem', color: 'text.disabled', fontWeight: 600 }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    letterSpacing: '-0.018em',
                  }}
                >
                  {c.name}
                </Typography>
                <Typography
                  className="pv-mono"
                  sx={{ textAlign: 'right', fontSize: '0.8125rem', color: 'text.secondary', whiteSpace: 'nowrap' }}
                >
                  {c.occupied.toLocaleString('hu-HU')} / {c.capacity.toLocaleString('hu-HU')}
                </Typography>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, pct)}
                    sx={{
                      height: 3,
                      backgroundColor: alpha(band, 0.15),
                      '& .MuiLinearProgress-bar': { backgroundColor: band, borderRadius: 0 },
                    }}
                  />
                </Box>
                <Typography
                  className="pv-mono"
                  sx={{
                    textAlign: 'right',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: band,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {pct}%
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Last update footnote */}
        {stream.lastEventAt && (
          <Typography
            className="pv-mono"
            sx={{ display: 'block', mt: 2, fontSize: '0.6875rem', color: 'text.disabled', letterSpacing: '0.08em', textAlign: 'right' }}
          >
            Utolsó adatfrissítés · {new Date(stream.lastEventAt).toLocaleTimeString('hu-HU')}
          </Typography>
        )}
      </Box>
    </PageTransition>
  );
}
