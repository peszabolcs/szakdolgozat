import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Button,
  Menu,
  MenuItem,
  alpha,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Language as LanguageIcon,
  Login as LoginIcon,
  ArrowOutward,
  PinDrop,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/useThemeMode';
import { useAuth } from '../contexts/useAuth';
import { ShoppingCenterCard } from '../components/ShoppingCenterCard';
import { InteractiveMap } from '../components/InteractiveMap';
import ReservationModal from '../components/ReservationModal';
import { shoppingCenters } from '../mocks/data/shoppingCenters';
import { shoppingCentersToAreas } from '../utils/dataAdapters';
import type { ShoppingCenter } from '../types';

export default function PublicHomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { actualTheme, setMode } = useThemeMode();
  const { isAuthenticated, user } = useAuth();
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [preselectedCenterId, setPreselectedCenterId] = useState<string | undefined>(undefined);

  const homeHref = isAuthenticated && user
    ? user.role === 'admin'
      ? '/admin/dashboard'
      : '/me'
    : '/login';
  const homeLabel = isAuthenticated && user
    ? user.role === 'admin' ? 'Admin konzol' : 'Saját fiók'
    : t('auth.login', 'Bejelentkezés');

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };
  const handleLanguageClose = () => setLangAnchorEl(null);
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };
  const handleThemeToggle = () => setMode(actualTheme === 'dark' ? 'light' : 'dark');
  const openReservation = (center?: ShoppingCenter) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setPreselectedCenterId(center?.id);
    setReservationOpen(true);
  };

  // Live numbers for hero stats strip
  const stats = useMemo(() => {
    const totalCenters = shoppingCenters.length;
    const totalCapacity = shoppingCenters.reduce((s, c) => s + c.capacity, 0);
    const totalOccupied = shoppingCenters.reduce((s, c) => s + c.occupied, 0);
    const totalFree = totalCapacity - totalOccupied;
    const fillRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
    return { totalCenters, totalCapacity, totalOccupied, totalFree, fillRate };
  }, []);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Editorial AppBar */}
      <AppBar position="sticky" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }}>
          <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ flexGrow: 1 }}>
            <Typography
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 500,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                letterSpacing: '-0.022em',
                color: 'text.primary',
              }}
            >
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>Park</Box>Vision
            </Typography>
            <Typography
              className="pv-eyebrow"
              sx={{ display: { xs: 'none', md: 'inline' }, color: 'text.secondary' }}
            >
              Civic parking intelligence
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton onClick={handleLanguageClick} aria-label="Change language" size="small" sx={{ color: 'text.secondary' }}>
              <LanguageIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleThemeToggle} aria-label="Toggle theme" size="small" sx={{ color: 'text.secondary' }}>
              {actualTheme === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
            <Button
              variant={isAuthenticated ? 'contained' : 'text'}
              startIcon={!isAuthenticated ? <LoginIcon /> : undefined}
              onClick={() => navigate(homeHref)}
              sx={{ ml: 1, color: isAuthenticated ? undefined : 'text.primary' }}
            >
              {homeLabel}
            </Button>
            {!isAuthenticated && (
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Regisztráció
              </Button>
            )}
          </Stack>

          <Menu anchorEl={langAnchorEl} open={Boolean(langAnchorEl)} onClose={handleLanguageClose}>
            <MenuItem onClick={() => handleLanguageChange('hu')} selected={i18n.language === 'hu'}>Magyar</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('en')} selected={i18n.language === 'en'}>English</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* === HERO === */}
      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 10 }, pb: { xs: 6, md: 12 } }}>
        <Grid container spacing={6} alignItems="flex-end">
          <Grid item xs={12} md={8}>
            <Typography
              className="pv-eyebrow pv-reveal pv-reveal-1"
              sx={{ display: 'inline-block', color: 'text.secondary', mb: 3 }}
            >
              № 01 · Budapest · {timeStr}
            </Typography>
            <Box className="pv-rule-saffron pv-reveal pv-reveal-1" sx={{ mb: 4 }} />

            <Typography
              variant="h1"
              component="h1"
              className="pv-reveal pv-reveal-2"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 400,
                fontSize: { xs: '2.75rem', sm: '3.75rem', md: '5rem', lg: '5.75rem' },
                lineHeight: 0.98,
                letterSpacing: '-0.028em',
                color: 'text.primary',
                mb: 3,
              }}
            >
              Először nézd meg.{' '}
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400, color: 'secondary.dark' }}>
                Aztán indulj.
              </Box>
            </Typography>

            <Typography
              variant="subtitle1"
              className="pv-reveal pv-reveal-3"
              sx={{
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                lineHeight: 1.5,
                color: 'text.secondary',
                maxWidth: 600,
                mb: 5,
              }}
            >
              {t(
                'public.hero.subtitle',
                'Élő parkolóhely-foglaltság Budapest legnagyobb bevásárlóközpontjaiban — szenzoros adatfolyam, statisztikai előrejelzés, egy kattintás a foglalás.'
              )}
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              className="pv-reveal pv-reveal-4"
              sx={{ mb: 4 }}
            >
              <Button
                size="large"
                variant="contained"
                endIcon={<ArrowOutward />}
                onClick={() => openReservation()}
                sx={{ px: 3, py: 1.5, fontSize: '1rem' }}
              >
                Foglalás indítása
              </Button>
              <Button
                size="large"
                variant="outlined"
                startIcon={<PinDrop />}
                onClick={() => document.getElementById('centers-grid')?.scrollIntoView({ behavior: 'smooth' })}
                sx={{ px: 3, py: 1.5, fontSize: '1rem' }}
              >
                Központok megtekintése
              </Button>
            </Stack>
          </Grid>

          {/* Stats column - editorial KPI strip */}
          <Grid item xs={12} md={4}>
            <Box className="pv-reveal pv-reveal-5">
              <Box
                sx={(theme) => ({
                  borderTop: `2px solid ${theme.palette.text.primary}`,
                  pt: 2,
                })}
              >
                <StatRow eyebrow="Központok" value={stats.totalCenters.toString().padStart(2, '0')} unit="db" />
                <StatRow eyebrow="Összkapacitás" value={stats.totalCapacity.toLocaleString('hu-HU')} unit="férőhely" />
                <StatRow eyebrow="Most szabad" value={stats.totalFree.toLocaleString('hu-HU')} unit={`(${100 - stats.fillRate}%)`} accent />
                <StatRow eyebrow="Frissítés" value="30s" unit="IoT-stream" mono last />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* === LIVE TICKER === */}
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.text.primary, 0.04) : alpha(theme.palette.text.primary, 0.04),
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 1.5,
          overflow: 'hidden',
        })}
      >
        <Box
          className="pv-marquee-track"
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.8125rem',
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            letterSpacing: '0.04em',
          }}
        >
          {[...shoppingCenters, ...shoppingCenters].map((c, i) => {
            const pct = Math.round((c.occupied / c.capacity) * 100);
            const band = pct < 60 ? 'free' : pct < 85 ? 'busy' : 'full';
            const color = band === 'free' ? '#4d7c0f' : band === 'busy' ? '#b45309' : '#991b1b';
            return (
              <Box key={`${c.id}-${i}`} component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mr: 6 }}>
                <Box component="span" className="pv-pulse" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, display: 'inline-block' }} />
                <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {c.name.toUpperCase()}
                </Box>
                <Box component="span">·</Box>
                <Box component="span">{pct}% telt</Box>
                <Box component="span" sx={{ color: 'text.disabled' }}>·</Box>
                <Box component="span" sx={{ color: 'text.disabled' }}>{c.capacity - c.occupied} szabad</Box>
                <Box component="span" sx={{ color: 'text.disabled', ml: 3 }}>—</Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* === MAP SECTION === */}
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 4, md: 6 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" sx={{ mb: 4 }} spacing={2}>
          <Box>
            <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1.5 }}>
              № 02 · Térképes nézet
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 400,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.022em',
                color: 'text.primary',
              }}
            >
              Budapest, <Box component="span" sx={{ fontStyle: 'italic' }}>élőben</Box>.
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
            Markerek színe a pillanatnyi foglaltságot jelzi. Váltás hőtérképre a térkép fejlécében.
          </Typography>
        </Stack>

        <Box
          sx={(theme) => ({
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            overflow: 'hidden',
            height: { xs: 360, md: 540 },
            boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 12px 30px -10px rgba(15, 27, 23, 0.18)',
          })}
        >
          <InteractiveMap
            areas={shoppingCentersToAreas(shoppingCenters)}
            showSearch={true}
            showUserLocation={true}
            height="100%"
            zoom={12}
          />
        </Box>
      </Container>

      {/* === CENTERS GRID === */}
      <Container id="centers-grid" maxWidth="xl" sx={{ pt: { xs: 8, md: 12 }, pb: 10 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" sx={{ mb: 5 }} spacing={2}>
          <Box>
            <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1.5 }}>
              № 03 · Bevásárlóközpontok · {shoppingCenters.length} db
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 400,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.022em',
                color: 'text.primary',
              }}
            >
              A teljes <Box component="span" sx={{ fontStyle: 'italic' }}>készlet</Box>.
            </Typography>
          </Box>
          <Box className="pv-rule-saffron" sx={{ display: { xs: 'none', md: 'block' }, mb: 1.5 }} />
        </Stack>

        <Grid container spacing={3}>
          {shoppingCenters.map((center, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={center.id}
              className={`pv-reveal pv-reveal-${Math.min(6, idx + 1)}`}
            >
              <ShoppingCenterCard center={center} onReserve={openReservation} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* === FOOTER === */}
      <Box
        component="footer"
        sx={(theme) => ({
          mt: 'auto',
          py: 6,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.text.primary, 0.03),
        })}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="flex-end">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  fontSize: '1.5rem',
                  letterSpacing: '-0.018em',
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                „Először nézd meg. Aztán indulj."
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Egy szakdolgozati prototípus a városi parkolás láthatóvá tételére.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                spacing={3}
                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                }}
              >
                <span>© 2026</span>
                <span>·</span>
                <span>Perjési Szabolcs</span>
                <span>·</span>
                <span>SzTE · Informatikai Intézet</span>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {reservationOpen && (
        <ReservationModal
          open={reservationOpen}
          onClose={() => setReservationOpen(false)}
          preselectedCenterId={preselectedCenterId}
          centers={shoppingCenters}
        />
      )}
    </Box>
  );
}

interface StatRowProps {
  eyebrow: string;
  value: string;
  unit: string;
  accent?: boolean;
  mono?: boolean;
  last?: boolean;
}

function StatRow({ eyebrow, value, unit, accent, mono, last }: StatRowProps) {
  return (
    <Box
      sx={(theme) => ({
        py: 1.5,
        borderBottom: last ? 'none' : `1px solid ${theme.palette.divider}`,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'baseline',
        columnGap: 2,
      })}
    >
      <Typography
        className="pv-eyebrow"
        sx={{ color: 'text.secondary' }}
      >
        {eyebrow}
      </Typography>
      <Box sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.75 }}>
        <Typography
          className="pv-mono"
          sx={{
            fontSize: { xs: '1.875rem', md: '2.25rem' },
            fontWeight: 600,
            color: accent ? 'secondary.dark' : 'text.primary',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
        <Typography
          className={mono ? 'pv-mono' : undefined}
          sx={{
            fontSize: '0.75rem',
            color: 'text.secondary',
            fontFamily: mono ? '"JetBrains Mono", monospace' : '"Bricolage Grotesque", sans-serif',
            letterSpacing: mono ? '0.08em' : 0,
            textTransform: mono ? 'uppercase' : 'none',
          }}
        >
          {unit}
        </Typography>
      </Box>
    </Box>
  );
}
