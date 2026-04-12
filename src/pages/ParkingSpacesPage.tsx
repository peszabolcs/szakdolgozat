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
} from '@mui/material';
import { useState, useMemo } from 'react';
import { useParkingSpaces } from '../hooks/useParkingSpaces';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { formatDistanceToNow } from '../utils/date';
import { useTranslation } from 'react-i18next';

export default function ParkingSpacesPage() {
  const { t } = useTranslation();
  const { data: spaces, isLoading, isError, error, refetch } = useParkingSpaces();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSpaces = useMemo(() => {
    if (!spaces) return [];
    if (statusFilter === 'all') return spaces;
    return spaces.filter((s) => s.status === statusFilter);
  }, [spaces, statusFilter]);

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

  if (!spaces || spaces.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('parkingSpaces.title')}
        </Typography>
        <EmptyState
          title={t('parkingSpaces.noSpacesTitle')}
          message={t('parkingSpaces.noSpacesMessage')}
          actionLabel={t('parkingSpaces.addParkingSpace')}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('parkingSpaces.title')}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('parkingSpaces.filter')}</InputLabel>
          <Select
            value={statusFilter}
            label={t('parkingSpaces.filter')}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">{t('parkingSpaces.allSpaces')}</MenuItem>
            <MenuItem value="occupied">{t('parkingSpaces.onlyOccupied')}</MenuItem>
            <MenuItem value="free">{t('parkingSpaces.onlyFree')}</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {filteredSpaces.length} {t('parkingSpaces.results')}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('parkingSpaces.tableHeaders.id')}</TableCell>
              <TableCell>{t('parkingSpaces.tableHeaders.status')}</TableCell>
              <TableCell>{t('parkingSpaces.tableHeaders.area')}</TableCell>
              <TableCell>{t('parkingSpaces.tableHeaders.updated')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSpaces.slice(0, 20).map((space) => (
              <TableRow key={space.id}>
                <TableCell>{space.id}</TableCell>
                <TableCell>
                  <Chip
                    label={space.status === 'occupied' ? t('parkingSpaces.occupied') : t('parkingSpaces.free')}
                    color={space.status === 'occupied' ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{space.areaName}</TableCell>
                <TableCell>{formatDistanceToNow(space.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
