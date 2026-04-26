import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
}

const MotionDiv = motion.div;

export default function StatCard({
  title,
  value,
  icon,
  color,
  delta,
  deltaLabel,
  accent = 'primary',
}: StatCardProps) {
  const theme = useTheme();
  const accentColor = theme.palette[accent].main;
  const accentLight = theme.palette[accent].light;

  const trendIcon =
    delta === undefined ? null : delta > 0 ? <TrendingUpIcon fontSize="small" /> : delta < 0 ? <TrendingDownIcon fontSize="small" /> : <TrendingFlatIcon fontSize="small" />;
  const trendColor =
    delta === undefined ? 'text.secondary' : delta > 0 ? 'success.main' : delta < 0 ? 'error.main' : 'text.secondary';

  return (
    <MotionDiv whileHover={{ y: -4 }} transition={{ duration: 0.2 }} style={{ height: '100%' }}>
      <Card
        sx={{
          height: '100%',
          minWidth: 200,
          position: 'relative',
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(accentColor, 0.18)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 60%)`
              : `linear-gradient(135deg, ${alpha(accentColor, 0.08)} 0%, ${alpha('#ffffff', 0.95)} 60%)`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 4,
            height: '100%',
            background: `linear-gradient(180deg, ${accentColor}, ${accentLight})`,
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.06em' }}
            >
              {title}
            </Typography>
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: alpha(accentColor, 0.12),
                  color: color || accentColor,
                }}
              >
                {icon}
              </Box>
            )}
          </Box>
          <Typography
            variant="h3"
            component="div"
            sx={{ color: color || 'text.primary', fontWeight: 700, lineHeight: 1.1 }}
          >
            {value}
          </Typography>
          {(delta !== undefined || deltaLabel) && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, gap: 0.75, color: trendColor }}>
              {trendIcon}
              {delta !== undefined && (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {delta > 0 ? '+' : ''}
                  {delta}%
                </Typography>
              )}
              {deltaLabel && (
                <Typography variant="caption" color="text.secondary">
                  {deltaLabel}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
