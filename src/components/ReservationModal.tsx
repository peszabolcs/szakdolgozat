import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  Alert,
  LinearProgress,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import type { ShoppingCenter } from '../types';
import {
  useCreateReservation,
  ReservationValidationError,
} from '../hooks/useReservations';

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  centers: ShoppingCenter[];
  preselectedCenterId?: string;
}

const SLOT_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

function todayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function buildSlotIso(dateIso: string, hour: number): string {
  const d = new Date(dateIso);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export default function ReservationModal({
  open,
  onClose,
  centers,
  preselectedCenterId,
}: ReservationModalProps) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const create = useCreateReservation();
  const [centerId, setCenterId] = useState<string>(preselectedCenterId ?? '');
  const [date, setDate] = useState<string>(todayIso());
  const [hour, setHour] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCenterId(preselectedCenterId ?? centers[0]?.id ?? '');
      setDate(todayIso());
      setHour(null);
      setError(null);
    }
  }, [open, preselectedCenterId, centers]);

  const selectedCenter = useMemo(
    () => centers.find((c) => c.id === centerId) ?? null,
    [centers, centerId]
  );

  const occupancyRate = selectedCenter
    ? (selectedCenter.occupied / selectedCenter.capacity) * 100
    : 0;
  const isFull = occupancyRate >= 100;
  const occupancyColor: 'success' | 'warning' | 'error' =
    occupancyRate >= 90 ? 'error' : occupancyRate >= 70 ? 'warning' : 'success';

  const slotIsoStart = hour !== null ? buildSlotIso(date, hour) : null;
  const slotIsoEnd = hour !== null ? buildSlotIso(date, hour + 1) : null;
  const slotIsPast = slotIsoStart ? new Date(slotIsoStart).getTime() <= Date.now() : false;

  const canSubmit = !!selectedCenter && hour !== null && !slotIsPast && !isFull;

  const handleSubmit = async () => {
    if (!selectedCenter || !slotIsoStart || !slotIsoEnd) return;
    if (isFull) {
      enqueueSnackbar(t('reservation.toast.fullCenter'), { variant: 'warning' });
      return;
    }
    if (slotIsPast) {
      setError(t('reservation.errors.pastSlot'));
      return;
    }
    try {
      await create.mutateAsync({
        centerId: selectedCenter.id,
        centerName: selectedCenter.name,
        slotStart: slotIsoStart,
        slotEnd: slotIsoEnd,
      });
      enqueueSnackbar(
        t('reservation.toast.success', {
          time: `${String(hour).padStart(2, '0')}:00`,
          center: selectedCenter.name,
        }),
        { variant: 'success' }
      );
      onClose();
    } catch (err) {
      if (err instanceof ReservationValidationError) {
        if (err.code === 'duplicate') {
          enqueueSnackbar(t('reservation.toast.duplicate'), { variant: 'warning' });
        } else {
          setError(err.message);
        }
      } else {
        enqueueSnackbar(t('reservation.toast.error'), { variant: 'error' });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <EventAvailableIcon color="primary" />
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            {t('reservation.title')}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} aria-label={t('common.cancel')}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            select
            fullWidth
            label={t('reservation.center')}
            value={centerId}
            onChange={(e) => {
              setCenterId(e.target.value);
              setError(null);
            }}
          >
            {centers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          {selectedCenter && (
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('reservation.currentOccupancy')}
                </Typography>
                <Chip
                  size="small"
                  label={`${occupancyRate.toFixed(0)}% • ${selectedCenter.capacity - selectedCenter.occupied} ${t('public.availableSpaces').toLowerCase()}`}
                  color={occupancyColor}
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min(occupancyRate, 100)}
                color={occupancyColor}
                sx={{ height: 8, borderRadius: 4 }}
              />
              {isFull && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {t('reservation.errors.fullCenter')}
                </Alert>
              )}
            </Box>
          )}

          <TextField
            type="date"
            fullWidth
            label={t('reservation.date')}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setHour(null);
              setError(null);
            }}
            inputProps={{ min: todayIso() }}
            InputLabelProps={{ shrink: true }}
          />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('reservation.timeSlot')}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 1 }}>
              {SLOT_HOURS.map((h) => {
                const iso = buildSlotIso(date, h);
                const past = new Date(iso).getTime() <= Date.now();
                return (
                  <Chip
                    key={h}
                    label={`${String(h).padStart(2, '0')}:00`}
                    onClick={() => {
                      setHour(h);
                      setError(null);
                    }}
                    color={hour === h ? 'primary' : 'default'}
                    variant={hour === h ? 'filled' : 'outlined'}
                    disabled={past}
                    sx={{ fontWeight: 600 }}
                  />
                );
              })}
            </Box>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit || create.isPending}
        >
          {t('reservation.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
