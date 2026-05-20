import { Card, Typography, Box, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
  delta?: number;
  deltaLabel?: string;
  accent?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  unit?: string;
  monoLabel?: string;
}

const MotionDiv = motion.div;

export default function StatCard({
  title,
  value,
  icon,
  delta,
  deltaLabel,
  accent = 'primary',
  unit,
  monoLabel,
}: StatCardProps) {
  const trendIcon =
    delta === undefined ? null : delta > 0 ? <TrendingUpIcon fontSize="small" /> : delta < 0 ? <TrendingDownIcon fontSize="small" /> : <TrendingFlatIcon fontSize="small" />;

  const trendColor =
    delta === undefined ? 'text.secondary' : delta > 0 ? 'success.main' : delta < 0 ? 'error.main' : 'text.secondary';

  const showAccentRule = accent === 'secondary' || accent === 'warning';

  return (
    <MotionDiv whileHover={{ y: -2 }} transition={{ duration: 0.22 }} style={{ height: '100%' }}>
      <Card
        sx={(theme) => ({
          height: '100%',
          minWidth: 0,
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 2.5, sm: 3 },
          backgroundColor: 'background.paper',
          border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {/* Top row: eyebrow + optional icon */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5, gap: 1 }}>
          <Box>
            <Typography
              className="pv-eyebrow"
              sx={{ display: 'block', color: 'text.secondary' }}
            >
              {title}
            </Typography>
            {monoLabel && (
              <Typography
                className="pv-mono"
                sx={{
                  display: 'block',
                  fontSize: '0.625rem',
                  color: 'text.disabled',
                  letterSpacing: '0.08em',
                  mt: 0.25,
                }}
              >
                {monoLabel}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={(theme) => ({
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                '& svg': { fontSize: 20 },
                opacity: theme.palette.mode === 'dark' ? 0.7 : 0.55,
              })}
            >
              {icon}
            </Box>
          )}
        </Box>

        {/* Hero number — editorial size */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 'auto' }}>
          <Typography
            className="pv-mono"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem' },
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.025em',
              color: 'text.primary',
            }}
          >
            {value}
          </Typography>
          {unit && (
            <Typography
              className="pv-mono"
              sx={{
                fontSize: '0.875rem',
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {unit}
            </Typography>
          )}
        </Box>

        {/* Optional accent rule for the second/warning KPIs */}
        {showAccentRule && (
          <Box
            sx={{
              mt: 2,
              width: 32,
              height: 2,
              bgcolor: 'secondary.main',
            }}
          />
        )}

        {/* Trend / delta */}
        {(delta !== undefined || deltaLabel) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', gap: 0.75, color: trendColor }}>
            {trendIcon}
            {delta !== undefined && (
              <Typography className="pv-mono" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                {delta > 0 ? '+' : ''}{delta}%
              </Typography>
            )}
            {deltaLabel && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {deltaLabel}
              </Typography>
            )}
          </Box>
        )}
      </Card>
    </MotionDiv>
  );
}
