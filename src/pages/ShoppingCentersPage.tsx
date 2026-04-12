import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { useShoppingCenters } from '../hooks/useShoppingCenters';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/PageTransition';
import MapIcon from '@mui/icons-material/Map';
import { useNavigate } from 'react-router-dom';

type OccupancyFilter = 'all' | 'low' | 'medium' | 'high';

export default function ShoppingCentersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: centers, isLoading, isError, error, refetch } = useShoppingCenters();
  const [occupancyFilter, setOccupancyFilter] = useState<OccupancyFilter>('all');

  const filteredCenters = useMemo(() => {
    if (!centers) return [];

    if (occupancyFilter === 'all') return centers;

    return centers.filter((center) => {
      const occupancyRate = (center.occupied / center.capacity) * 100;

      if (occupancyFilter === 'low') return occupancyRate < 50;
      if (occupancyFilter === 'medium') return occupancyRate >= 50 && occupancyRate < 80;
      if (occupancyFilter === 'high') return occupancyRate >= 80;

      return true;
    });
  }, [centers, occupancyFilter]);

  const getOccupancyColor = (occupancyRate: number) => {
    if (occupancyRate >= 90) return 'error';
    if (occupancyRate >= 70) return 'warning';
    return 'success';
  };

  if (isLoading) {
    return <Typography>{t('common.loading')}</Typography>;
  }

  if (isError) {
    return (
      <ErrorBanner
        message={t('common.errorOccurred', {
          message: error instanceof Error ? error.message : t('common.unknownError')
        })}
        onRetry={() => refetch()}
      />
    );
  }

  if (!centers || centers.length === 0) {
    return (
      <PageTransition>
        <Box>
          <Typography variant="h4" gutterBottom>
            {t('shoppingCenters.title')}
          </Typography>
          <EmptyState
            title={t('shoppingCenters.noCentersTitle')}
            message={t('shoppingCenters.noCentersMessage')}
          />
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('shoppingCenters.title')}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t('shoppingCenters.filter')}</InputLabel>
            <Select
              value={occupancyFilter}
              label={t('shoppingCenters.filter')}
              onChange={(e) => setOccupancyFilter(e.target.value as OccupancyFilter)}
            >
              <MenuItem value="all">{t('shoppingCenters.filterAll')}</MenuItem>
              <MenuItem value="low">{t('shoppingCenters.filterLow')}</MenuItem>
              <MenuItem value="medium">{t('shoppingCenters.filterMedium')}</MenuItem>
              <MenuItem value="high">{t('shoppingCenters.filterHigh')}</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {filteredCenters.length} {t('shoppingCenters.results')}
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('shoppingCenters.tableHeaders.name')}</TableCell>
                <TableCell>{t('shoppingCenters.tableHeaders.address')}</TableCell>
                <TableCell align="center">{t('shoppingCenters.tableHeaders.capacity')}</TableCell>
                <TableCell align="center">{t('shoppingCenters.tableHeaders.occupied')}</TableCell>
                <TableCell align="center">{t('shoppingCenters.tableHeaders.available')}</TableCell>
                <TableCell sx={{ minWidth: 200 }}>{t('shoppingCenters.tableHeaders.occupancy')}</TableCell>
                <TableCell align="center">{t('shoppingCenters.tableHeaders.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCenters.map((center) => {
                const occupancyRate = (center.occupied / center.capacity) * 100;
                const available = center.capacity - center.occupied;

                return (
                  <TableRow key={center.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {center.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {center.address}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{center.capacity}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={center.occupied}
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={available}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LinearProgress
                            variant="determinate"
                            value={occupancyRate}
                            color={getOccupancyColor(occupancyRate)}
                            sx={{ flex: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" sx={{ minWidth: 45 }}>
                            {occupancyRate.toFixed(0)}%
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('shoppingCenters.viewOnMap')}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate('/admin/map')}
                          aria-label={t('shoppingCenters.viewOnMap')}
                        >
                          <MapIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </PageTransition>
  );
}
