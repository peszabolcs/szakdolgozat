import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAreas } from '../hooks/useAreas';
import { PageTransition } from '../components/PageTransition';
import { InteractiveMap } from '../components/InteractiveMap';

const MapPage = () => {
  const { t } = useTranslation();
  const { data: areas, isLoading, isError } = useAreas();

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography role="status" aria-live="polite">
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" role="alert">
          {t('error.loadingFailed')}
        </Typography>
      </Box>
    );
  }

  return (
    <PageTransition>
      <Box sx={{ height: 'calc(100vh - 64px)' }}>
        <InteractiveMap
          areas={areas || []}
          showSearch={true}
          showUserLocation={true}
          zoom={12}
        />
      </Box>
    </PageTransition>
  );
};

export default MapPage;
