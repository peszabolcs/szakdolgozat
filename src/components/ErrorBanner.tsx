import { Alert, Button, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <Box sx={{ mb: 2 }} role="alert" aria-live="assertive">
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Újrapróbálás
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Box>
  );
}
