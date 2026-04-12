import { Close, GetApp } from '@mui/icons-material';
import { Alert, Button, IconButton, Slide, Snackbar } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePWA } from '../hooks/usePWA';

export const PWAInstallPrompt = () => {
  const { t } = useTranslation();
  const { isInstallable, install } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!isInstallable || dismissed) return null;

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Slide}
      sx={{ bottom: { xs: 80, sm: 24 } }}
    >
      <Alert
        severity="info"
        icon={<GetApp />}
        action={
          <>
            <Button color="inherit" size="small" onClick={handleInstall}>
              {t('pwa.install')}
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleDismiss}
            >
              <Close fontSize="small" />
            </IconButton>
          </>
        }
        sx={{
          width: '100%',
          maxWidth: 600,
          '& .MuiAlert-message': {
            flex: 1,
          },
        }}
      >
        {t('pwa.installPrompt')}
      </Alert>
    </Snackbar>
  );
};
