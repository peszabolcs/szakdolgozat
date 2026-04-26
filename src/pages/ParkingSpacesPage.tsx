import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useTranslation } from 'react-i18next';
import { useParkingSpaces } from '../hooks/useParkingSpaces';
import { TableSkeleton } from '../components/skeletons';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';

type StatusFilter = 'all' | 'free' | 'occupied';
const PAGE_SIZE = 24;

export default function ParkingSpacesPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch } = useParkingSpaces();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const spaces = useMemo(() => data ?? [], [data]);
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return spaces.filter((space) => {
      if (statusFilter !== 'all' && space.status !== statusFilter) return false;
      if (s && !`${space.areaName} ${space.id}`.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [spaces, statusFilter, search]);

  const totals = useMemo(() => {
    const total = spaces.length;
    const occupied = spaces.filter((s) => s.status === 'occupied').length;
    return { total, occupied, free: total - occupied };
  }, [spaces]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          {t('parkingSpaces.title')}
        </Typography>
        <TableSkeleton rows={8} columns={5} />
      </Box>
    );
  }

  if (isError) {
    return (
      <ErrorBanner
        title={t('error.loadingFailed')}
        message={(error as Error)?.message ?? t('common.unknownError')}
        onRetry={() => refetch()}
      />
    );
  }

  if (spaces.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          {t('parkingSpaces.title')}
        </Typography>
        <EmptyState
          title={t('parkingSpaces.noSpacesTitle')}
          message={t('parkingSpaces.noSpacesMessage')}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        {t('parkingSpaces.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('parkingSpaces.subtitle')}
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              {t('parkingSpaces.totalSpaces')}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {totals.total}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, borderTop: '3px solid', borderColor: 'error.main' }}>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              {t('parkingSpaces.occupied')}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
              {totals.occupied}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, borderTop: '3px solid', borderColor: 'success.main' }}>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              {t('parkingSpaces.free')}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {totals.free}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }} alignItems={{ md: 'center' }}>
        <TextField
          placeholder={t('parkingSpaces.searchPlaceholder')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(_, v) => {
            if (v) {
              setStatusFilter(v);
              setPage(1);
            }
          }}
          aria-label={t('parkingSpaces.filterStatus')}
          size="small"
        >
          <ToggleButton value="all">{t('parkingSpaces.allSpaces')}</ToggleButton>
          <ToggleButton value="free">{t('parkingSpaces.free')}</ToggleButton>
          <ToggleButton value="occupied">{t('parkingSpaces.occupied')}</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filtered.length} {t('parkingSpaces.results')}
      </Typography>

      {filtered.length === 0 ? (
        <EmptyState
          title={t('parkingSpaces.noResultsTitle')}
          message={t('parkingSpaces.noResultsMessage')}
        />
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3, 1fr)',
                sm: 'repeat(6, 1fr)',
                md: 'repeat(8, 1fr)',
                lg: 'repeat(12, 1fr)',
              },
              gap: 1.5,
            }}
          >
            {pageItems.map((space) => (
              <Box
                key={space.id}
                role="button"
                aria-label={`${space.id} — ${space.status}`}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  textAlign: 'center',
                  bgcolor: space.status === 'occupied' ? 'error.light' : 'success.light',
                  color: space.status === 'occupied' ? 'error.contrastText' : 'success.contrastText',
                  transition: 'transform 0.15s ease',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                {space.status === 'occupied' ? (
                  <HighlightOffIcon fontSize="small" sx={{ opacity: 0.85 }} />
                ) : (
                  <CheckCircleOutlineIcon fontSize="small" sx={{ opacity: 0.85 }} />
                )}
                <Typography variant="caption" display="block" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {space.id.split('-').slice(-1)[0]}
                </Typography>
                <Typography variant="caption" display="block" sx={{ opacity: 0.85, fontSize: '0.65rem' }}>
                  {space.areaName.split(' ')[0]}
                </Typography>
              </Box>
            ))}
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 3 }} alignItems={{ md: 'center' }} justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              <Chip size="small" label={`${t('parkingSpaces.free')}: ${totals.free}`} color="success" variant="outlined" />
              <Chip size="small" label={`${t('parkingSpaces.occupied')}: ${totals.occupied}`} color="error" variant="outlined" />
            </Stack>
            <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" size="small" />
          </Stack>
        </>
      )}
    </Box>
  );
}
