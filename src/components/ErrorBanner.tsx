import { Alert, Button, Box, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

const MotionBox = motion(Box);

export default function ErrorBanner({ message, onRetry, title }: ErrorBannerProps) {
  const { t } = useTranslation();
  return (
    <MotionBox
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      sx={{ mb: 2 }}
      role="alert"
      aria-live="assertive"
    >
      <Alert
        severity="error"
        icon={
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex' }}
          >
            <ErrorOutlineIcon />
          </motion.div>
        }
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
              sx={{
                fontWeight: 600,
                '&:hover svg': { transform: 'rotate(180deg)' },
                '& svg': { transition: 'transform 0.4s ease' },
              }}
            >
              {t('common.retry', 'Újrapróbálás')}
            </Button>
          )
        }
        sx={{
          borderLeft: '4px solid',
          borderLeftColor: 'error.main',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(248, 113, 113, 0.18)'
              : '0 4px 12px rgba(239, 68, 68, 0.15)',
          alignItems: 'center',
        }}
      >
        {title && (
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {title}
          </Typography>
        )}
        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
          {message}
        </Typography>
      </Alert>
    </MotionBox>
  );
}
