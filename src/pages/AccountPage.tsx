import { useMemo, useState } from 'react';
import { Box, Typography, Grid, Stack, Button, alpha } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useReservations } from '../hooks/useReservations';
import { useShoppingCenters } from '../hooks/useShoppingCenters';
import { ShoppingCenterCard } from '../components/ShoppingCenterCard';
import ReservationModal from '../components/ReservationModal';
import { PageTransition } from '../components/PageTransition';
import type { ShoppingCenter } from '../types';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: reservations } = useReservations();
  const { data: centers } = useShoppingCenters();
  const [reservationOpen, setReservationOpen] = useState(false);
  const [preselectedCenterId, setPreselectedCenterId] = useState<string | undefined>(undefined);

  const stats = useMemo(() => {
    const list = reservations ?? [];
    const now = Date.now();
    const upcoming = list.filter((r) => r.status === 'active' && new Date(r.slotStart).getTime() >= now);
    const past = list.filter((r) => r.status === 'cancelled' || new Date(r.slotStart).getTime() < now);
    return { total: list.length, upcoming: upcoming.length, past: past.length, nextSlot: upcoming[0] };
  }, [reservations]);

  // Suggest 3 least-busy centers as quick-reserve targets
  const suggested = useMemo(() => {
    if (!centers) return [];
    return [...centers]
      .map((c) => ({ ...c, ratio: c.capacity > 0 ? c.occupied / c.capacity : 0 }))
      .sort((a, b) => a.ratio - b.ratio)
      .slice(0, 3);
  }, [centers]);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const openReservation = (center?: ShoppingCenter) => {
    setPreselectedCenterId(center?.id);
    setReservationOpen(true);
  };

  return (
    <PageTransition>
      <Box className="pv-reveal pv-reveal-1">
        {/* === Hero === */}
        <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
          № M·01 · Saját fiók · {timeStr}
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 400,
            fontSize: { xs: '2.25rem', md: '3.25rem' },
            lineHeight: 1.05,
            letterSpacing: '-0.024em',
            color: 'text.primary',
            mb: 1,
          }}
        >
          Üdv, {user?.name?.split(' ')[0] || 'Vendég'}.{' '}
          <Box component="span" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            Hol parkolsz ma?
          </Box>
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
          A személyes vezérlőd: foglalások, javasolt központok, és gyors hozzáférés a térképhez.
        </Typography>

        <Box className="pv-rule-saffron" sx={{ mt: 3, mb: 4 }} />

        {/* === Personal KPIs === */}
        <Grid container spacing={2.5} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={4}>
            <StatBlock
              eyebrow="Összes foglalás"
              monoLabel="M·01"
              value={String(stats.total).padStart(2, '0')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatBlock
              eyebrow="Közelgő"
              monoLabel="M·02"
              value={String(stats.upcoming).padStart(2, '0')}
              accent
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatBlock
              eyebrow="Lezárt / lemondott"
              monoLabel="M·03"
              value={String(stats.past).padStart(2, '0')}
            />
          </Grid>
        </Grid>

        {/* === Next reservation callout === */}
        {stats.nextSlot ? (
          <Box
            sx={(theme) => ({
              p: 3,
              mb: 6,
              border: `1px solid ${alpha(theme.palette.text.primary, 0.16)}`,
              borderLeft: `4px solid ${theme.palette.secondary.main}`,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.secondary.main, 0.04),
            })}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'secondary.dark', mb: 0.75 }}>
                  Következő foglalás
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 500,
                    fontSize: '1.75rem',
                    letterSpacing: '-0.022em',
                    color: 'text.primary',
                    lineHeight: 1.1,
                  }}
                >
                  {stats.nextSlot.centerName}
                </Typography>
                <Typography
                  className="pv-mono"
                  sx={{ mt: 0.75, fontSize: '0.875rem', color: 'text.secondary', letterSpacing: '0.02em' }}
                >
                  {new Date(stats.nextSlot.slotStart).toLocaleString('hu-HU', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' – '}
                  {new Date(stats.nextSlot.slotEnd).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
              <Button
                variant="contained"
                endIcon={<ArrowOutwardIcon />}
                onClick={() => navigate('/me/reservations')}
              >
                Foglalásaim
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box
            sx={(theme) => ({
              p: 3,
              mb: 6,
              border: `1px dashed ${alpha(theme.palette.text.primary, 0.18)}`,
              borderRadius: 1,
            })}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
              <Box>
                <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 0.75 }}>
                  Nincs aktív foglalásod
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    fontSize: '1.5rem',
                    color: 'text.primary',
                  }}
                >
                  Foglalj egyet most.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<EventAvailableIcon />}
                onClick={() => openReservation()}
              >
                Foglalás indítása
              </Button>
            </Stack>
          </Box>
        )}

        {/* === Suggested centers === */}
        <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 2.5 }}>
          <Box>
            <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
              № M·02 · Most ajánljuk
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 500,
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.022em',
                color: 'text.primary',
              }}
            >
              A legkevésbé zsúfolt központok.
            </Typography>
          </Box>
          <Button
            variant="text"
            onClick={() => navigate('/')}
            endIcon={<ArrowOutwardIcon />}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Összes megtekintése
          </Button>
        </Stack>

        <Grid container spacing={2.5}>
          {suggested.map((center) => (
            <Grid item xs={12} sm={6} md={4} key={center.id}>
              <ShoppingCenterCard center={center} onReserve={openReservation} />
            </Grid>
          ))}
        </Grid>

        {reservationOpen && centers && (
          <ReservationModal
            open={reservationOpen}
            onClose={() => setReservationOpen(false)}
            preselectedCenterId={preselectedCenterId}
            centers={centers}
          />
        )}
      </Box>
    </PageTransition>
  );
}

function StatBlock({
  eyebrow,
  monoLabel,
  value,
  accent,
}: {
  eyebrow: string;
  monoLabel: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Box
      sx={(theme) => ({
        p: 3,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
        borderRadius: 1,
        backgroundColor: 'background.paper',
        height: '100%',
      })}
    >
      <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary' }}>
        {eyebrow}
      </Typography>
      <Typography
        className="pv-mono"
        sx={{ display: 'block', fontSize: '0.625rem', color: 'text.disabled', letterSpacing: '0.08em', mt: 0.25, mb: 2 }}
      >
        {monoLabel}
      </Typography>
      <Typography
        className="pv-mono"
        sx={{
          fontSize: '3rem',
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: '-0.025em',
          color: accent ? 'secondary.dark' : 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
