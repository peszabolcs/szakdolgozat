import { Box, Card, Skeleton, Stack, Typography, alpha, useTheme } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { useForecast, ForecastPoint } from '../hooks/useForecast';
import ErrorBanner from './ErrorBanner';

interface ForecastChartProps {
  centerId: string;
  hoursAhead?: number;
  title?: string;
}

function formatHour(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:00`;
}

function ratioBand(ratio: number): 'free' | 'busy' | 'full' {
  if (ratio < 0.6) return 'free';
  if (ratio < 0.85) return 'busy';
  return 'full';
}

export function ForecastChart({ centerId, hoursAhead = 24, title = 'Foglaltsági előrejelzés' }: ForecastChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data, isLoading, isError, refetch, error } = useForecast(centerId, hoursAhead);

  if (isLoading) {
    return (
      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" width={240} height={28} />
        <Skeleton variant="rectangular" height={260} sx={{ mt: 2 }} />
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <ErrorBanner
        message={(error as Error)?.message ?? 'Nem sikerült betölteni az előrejelzést.'}
        onRetry={() => refetch()}
      />
    );
  }

  const chartData = data.points.map((p: ForecastPoint) => ({
    hour: formatHour(p.hour),
    ratio: Math.round(p.predictedRatio * 100),
    occupancy: p.predictedOccupancy,
    band: ratioBand(p.predictedRatio),
    confidence: p.confidence,
  }));

  const bestSlot = data.bestSlot;
  const bestHour = bestSlot ? formatHour(bestSlot.hour) : null;

  const colorFree = '#4d7c0f';
  const colorBusy = '#b45309';
  const colorFull = '#991b1b';
  const colorAccent = isDark ? '#F5F1E8' : '#0F1B17';

  const highConfidenceCount = data.points.filter((p) => p.confidence === 'high').length;

  return (
    <Card sx={{ overflow: 'hidden' }}>
      {/* Editorial header */}
      <Box sx={{ p: 3, pb: 2.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box sx={{ flex: 1 }}>
            <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
              ML · Idősoros becslés · {hoursAhead}h
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 500,
                fontSize: '1.625rem',
                letterSpacing: '-0.02em',
                color: 'text.primary',
                lineHeight: 1.15,
              }}
            >
              {title}.
            </Typography>
            <Typography
              className="pv-mono"
              sx={{ display: 'block', mt: 1, fontSize: '0.6875rem', color: 'text.disabled', letterSpacing: '0.04em' }}
            >
              {data.lookbackDays} nap visszatekintés · {data.sampleSize} mintapont · {highConfidenceCount}/{data.points.length} óra magas konfidencia
            </Typography>
          </Box>

          {bestSlot && (
            <Box
              sx={(t) => ({
                px: 1.5,
                py: 1.25,
                border: `1px solid ${alpha(colorFree, 0.5)}`,
                borderRadius: 1,
                backgroundColor: alpha(colorFree, t.palette.mode === 'dark' ? 0.12 : 0.06),
                minWidth: 180,
              })}
            >
              <Typography
                className="pv-eyebrow"
                sx={{ display: 'block', color: colorFree, mb: 0.25 }}
              >
                Legjobb idősáv
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography
                  className="pv-mono"
                  sx={{ fontSize: '1.5rem', fontWeight: 600, color: colorFree, letterSpacing: '-0.02em', lineHeight: 1 }}
                >
                  {bestHour}
                </Typography>
                <Typography className="pv-mono" sx={{ fontSize: '0.875rem', color: colorFree, fontWeight: 500 }}>
                  · {Math.round(bestSlot.predictedRatio * 100)}%
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Chart */}
      <Box sx={{ height: 260, px: 2, pb: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorAccent} stopOpacity={0.32} />
                <stop offset="100%" stopColor={colorAccent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.08)} />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: theme.palette.text.secondary }}
              interval="preserveStartEnd"
              tickLine={false}
              axisLine={{ stroke: alpha(theme.palette.text.primary, 0.2) }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: theme.palette.text.secondary }}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 4,
                border: `1px solid ${theme.palette.text.primary}`,
                backgroundColor: theme.palette.background.paper,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
              }}
              cursor={{ stroke: alpha(theme.palette.text.primary, 0.3), strokeWidth: 1 }}
              formatter={(value, _name, ctx) => {
                const ratio = typeof value === 'number' ? value : 0;
                const band = (ctx as unknown as { payload?: { band?: 'free' | 'busy' | 'full' } })?.payload?.band;
                const label = band === 'free' ? 'szabad' : band === 'busy' ? 'forgalmas' : 'telt';
                return [`${ratio}% (${label})`, 'Foglaltság'];
              }}
            />
            <ReferenceLine
              y={85}
              stroke={colorFull}
              strokeDasharray="4 4"
              strokeOpacity={0.7}
              label={{ value: '85%', fontSize: 10, fontFamily: 'JetBrains Mono', fill: colorFull, position: 'right' }}
            />
            <ReferenceLine
              y={60}
              stroke={colorBusy}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{ value: '60%', fontSize: 10, fontFamily: 'JetBrains Mono', fill: colorBusy, position: 'right' }}
            />
            <Area
              type="monotone"
              dataKey="ratio"
              stroke={colorAccent}
              strokeWidth={1.75}
              fill="url(#forecastFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend strip */}
      <Box
        sx={(t) => ({
          px: 3,
          py: 1.75,
          borderTop: `1px solid ${t.palette.divider}`,
          backgroundColor: alpha(t.palette.text.primary, 0.025),
        })}
      >
        <Stack direction="row" spacing={2.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <LegendDot color={colorFree} label="< 60% szabad" />
          <LegendDot color={colorBusy} label="60–85% forgalmas" />
          <LegendDot color={colorFull} label="> 85% telt" />
        </Stack>
      </Box>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
      <Typography
        className="pv-mono"
        sx={{ fontSize: '0.6875rem', color: 'text.secondary', letterSpacing: '0.04em' }}
      >
        {label}
      </Typography>
    </Stack>
  );
}
