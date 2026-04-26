import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  useCancelReservation,
  useReservations,
} from '../hooks/useReservations';
import EmptyState from '../components/EmptyState';
import type { Reservation } from '../types';

function formatDateTime(iso: string, locale: string): string {
  return new Date(iso).toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ReservationItem({
  reservation,
  onCancel,
  isPast,
  locale,
  cancelLabel,
}: {
  reservation: Reservation;
  onCancel: (id: string) => void;
  isPast: boolean;
  locale: string;
  cancelLabel: string;
}) {
  const cancelled = reservation.status === 'cancelled';
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StorefrontIcon />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {reservation.centerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(reservation.slotStart, locale)} – {new Date(reservation.slotEnd).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {cancelled && <Chip label="Lemondva" size="small" color="default" />}
            {!cancelled && isPast && <Chip label="Lezárt" size="small" color="default" />}
            {!cancelled && !isPast && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onCancel(reservation.id)}
              >
                {cancelLabel}
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ReservationsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useReservations();
  const cancel = useCancelReservation();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const reservations = useMemo(() => data ?? [], [data]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return reservations
      .filter((r) => r.status === 'active' && new Date(r.slotEnd).getTime() > now)
      .sort((a, b) => new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime());
  }, [reservations]);

  const past = useMemo(() => {
    const now = Date.now();
    return reservations
      .filter((r) => r.status === 'cancelled' || new Date(r.slotEnd).getTime() <= now)
      .sort((a, b) => new Date(b.slotStart).getTime() - new Date(a.slotStart).getTime());
  }, [reservations]);

  const handleCancel = async (id: string) => {
    await cancel.mutateAsync(id);
    enqueueSnackbar(t('reservation.toast.cancelled'), { variant: 'info' });
  };

  if (isLoading) {
    return <Typography>{t('common.loading')}</Typography>;
  }

  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        {t('reservation.pageTitle')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('reservation.pageSubtitle')}
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2 }}
        aria-label={t('reservation.pageTitle')}
      >
        <Tab value="upcoming" label={`${t('reservation.tabs.upcoming')} (${upcoming.length})`} />
        <Tab value="past" label={`${t('reservation.tabs.past')} (${past.length})`} />
      </Tabs>
      <Divider sx={{ mb: 2 }} />

      {list.length === 0 ? (
        <EmptyState
          variant="reservations"
          title={
            tab === 'upcoming'
              ? t('reservation.empty.upcomingTitle')
              : t('reservation.empty.pastTitle')
          }
          message={
            tab === 'upcoming'
              ? t('reservation.empty.upcomingMessage')
              : t('reservation.empty.pastMessage')
          }
          actionLabel={tab === 'upcoming' ? t('reservation.empty.cta') : undefined}
          onAction={tab === 'upcoming' ? () => navigate('/') : undefined}
        />
      ) : (
        <Box>
          {list.map((r) => (
            <ReservationItem
              key={r.id}
              reservation={r}
              onCancel={handleCancel}
              isPast={tab === 'past'}
              locale={i18n.language}
              cancelLabel={t('reservation.cancel')}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
