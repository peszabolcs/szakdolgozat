import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'reservations' | 'centers';
}

const MotionBox = motion(Box);

function EmptyIllustration({ variant, primary, secondary }: { variant: EmptyStateProps['variant']; primary: string; secondary: string }) {
  if (variant === 'reservations') {
    return (
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="es-grad-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} stopOpacity="0.18" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="68" fill="url(#es-grad-r)" />
        <rect x="44" y="50" width="72" height="62" rx="10" fill={primary} fillOpacity="0.10" stroke={primary} strokeWidth="1.5" />
        <rect x="44" y="50" width="72" height="14" rx="10" fill={primary} fillOpacity="0.18" />
        <line x1="60" y1="42" x2="60" y2="58" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        <line x1="100" y1="42" x2="100" y2="58" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        <circle cx="64" cy="80" r="3" fill={primary} fillOpacity="0.3" />
        <circle cx="80" cy="80" r="3" fill={primary} fillOpacity="0.3" />
        <circle cx="96" cy="80" r="3" fill={primary} fillOpacity="0.3" />
        <circle cx="64" cy="96" r="3" fill={primary} fillOpacity="0.3" />
        <path d="M 76 96 L 80 100 L 88 90" stroke={secondary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="es-grad-d" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.20" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="68" fill="url(#es-grad-d)" />
      <path
        d="M 80 38 C 60 38 48 52 48 70 C 48 92 80 122 80 122 C 80 122 112 92 112 70 C 112 52 100 38 80 38 Z"
        fill={primary}
        fillOpacity="0.85"
      />
      <text x="80" y="80" textAnchor="middle" fontSize="32" fontWeight="800" fill="#fff" fontFamily="Inter, system-ui, sans-serif">
        P
      </text>
      <circle cx="48" cy="124" r="4" fill={secondary} fillOpacity="0.5" />
      <circle cx="112" cy="124" r="4" fill={secondary} fillOpacity="0.5" />
      <circle cx="80" cy="134" r="3" fill={primary} fillOpacity="0.4" />
    </svg>
  );
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  const theme = useTheme();
  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 320,
        p: 4,
        textAlign: 'center',
      }}
      role="status"
      aria-label={title}
    >
      <Box sx={{ mb: 2 }}>
        <EmptyIllustration
          variant={variant}
          primary={theme.palette.primary.main}
          secondary={theme.palette.secondary.main}
        />
      </Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 420 }}>
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" size="large" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </MotionBox>
  );
}
