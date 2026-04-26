import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Paper,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  LocalParking,
  Brightness4,
  Brightness7,
  Language as LanguageIcon,
  Login as LoginIcon,
  EventAvailable,
  ExploreOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeMode } from '../contexts/useThemeMode';
import { ShoppingCenterCard } from '../components/ShoppingCenterCard';
import { InteractiveMap } from '../components/InteractiveMap';
import ReservationModal from '../components/ReservationModal';
import { shoppingCenters } from '../mocks/data/shoppingCenters';
import { shoppingCentersToAreas } from '../utils/dataAdapters';
import type { ShoppingCenter } from '../types';

const MotionBox = motion(Box);
const MotionGridItem = motion(Grid);

export default function PublicHomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { actualTheme, setMode } = useThemeMode();
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [preselectedCenterId, setPreselectedCenterId] = useState<string | undefined>(undefined);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };

  const handleThemeToggle = () => {
    setMode(actualTheme === 'dark' ? 'light' : 'dark');
  };

  const openReservation = (center?: ShoppingCenter) => {
    setPreselectedCenterId(center?.id);
    setReservationOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'inherit', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <LocalParking sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: '-0.01em' }}>
            ParkVision
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={handleLanguageClick}
              aria-label="Change language"
            >
              <LanguageIcon />
            </IconButton>
            <IconButton
              onClick={handleThemeToggle}
              aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {actualTheme === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{ ml: 1 }}
            >
              {t('auth.login', 'Login')}
            </Button>
          </Stack>

          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLanguageClose}
          >
            <MenuItem
              onClick={() => handleLanguageChange('en')}
              selected={i18n.language === 'en'}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageChange('hu')}
              selected={i18n.language === 'hu'}
            >
              Magyar
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a464f 0%, #26636f 45%, #00897b 100%)'
              : 'linear-gradient(135deg, #26636f 0%, #00897b 60%, #f9a825 130%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-30%',
            left: '-15%',
            width: '60%',
            height: '120%',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.18), transparent 60%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            right: '-15%',
            width: '60%',
            height: '120%',
            background: 'radial-gradient(circle at center, rgba(249,168,37,0.18), transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 2px 12px rgba(0,0,0,0.18)' }}
            >
              {t('public.hero.title', 'Find Your Perfect Parking Spot')}
            </Typography>
            <Typography variant="h6" sx={{ mb: 5, opacity: 0.92, fontWeight: 400, maxWidth: 720, mx: 'auto' }}>
              {t('public.hero.subtitle', 'Real-time parking availability in Budapest shopping centers')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                size="large"
                variant="contained"
                color="secondary"
                startIcon={<EventAvailable />}
                onClick={() => openReservation()}
                sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 700 }}
              >
                {t('public.hero.reserveCta', 'Foglalás indítása')}
              </Button>
              <Button
                size="large"
                variant="outlined"
                startIcon={<ExploreOutlined />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.6)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
                onClick={() => {
                  document.getElementById('centers-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('public.hero.exploreCta', 'Központok böngészése')}
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      {/* Interactive Map */}
      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ height: { xs: '320px', sm: '420px', md: '500px' } }}>
            <InteractiveMap
              areas={shoppingCentersToAreas(shoppingCenters)}
              showSearch={true}
              showUserLocation={true}
              height="100%"
              zoom={12}
            />
          </Box>
        </Paper>
      </Container>

      {/* Shopping Centers Grid */}
      <Container id="centers-grid" maxWidth="lg" sx={{ mt: { xs: 6, md: 8 }, mb: 6 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" spacing={1} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.1em' }}>
              {t('public.shoppingCenters.eyebrow', 'Budapest')}
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
              {t('public.shoppingCenters.title', 'Shopping Centers')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('public.shoppingCenters.subtitle', 'Élő parkolóhely-kihasználtság, egyetlen kattintással foglalható.')}
            </Typography>
          </Box>
        </Stack>
        <Grid container spacing={3}>
          {shoppingCenters.map((center, idx) => (
            <MotionGridItem
              item
              xs={12}
              sm={6}
              md={4}
              key={center.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
            >
              <ShoppingCenterCard center={center} onReserve={openReservation} />
            </MotionGridItem>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 4,
          px: 2,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalParking sx={{ color: 'primary.main' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ParkVision
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" align="center">
              © 2026 ParkVision · {t('public.footer.rights', 'All rights reserved.')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              v0.3.0 — MVP
            </Typography>
          </Stack>
        </Container>
      </Box>

      <ReservationModal
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
        centers={shoppingCenters}
        preselectedCenterId={preselectedCenterId}
      />
    </Box>
  );
}
