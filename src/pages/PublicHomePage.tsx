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
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/useThemeMode';
import { ShoppingCenterCard } from '../components/ShoppingCenterCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { shoppingCenters } from '../mocks/data/shoppingCenters';
import { shoppingCentersToAreas } from '../utils/dataAdapters';

export default function PublicHomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { actualTheme, setMode } = useThemeMode();
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <LocalParking sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ParkVision
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              color="inherit"
              onClick={handleLanguageClick}
              aria-label="Change language"
            >
              <LanguageIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {actualTheme === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Button
              color="inherit"
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
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            {t('public.hero.title', 'Find Your Perfect Parking Spot')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            {t('public.hero.subtitle', 'Real-time parking availability in Budapest shopping centers')}
          </Typography>
        </Container>
      </Box>

      {/* Interactive Map */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: { xs: '300px', sm: '400px', md: '500px' } }}>
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
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          {t('public.shoppingCenters.title', 'Shopping Centers')}
        </Typography>
        <Grid container spacing={3}>
          {shoppingCenters.map((center) => (
            <Grid item xs={12} sm={6} md={4} key={center.id}>
              <ShoppingCenterCard center={center} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 3,
          px: 2,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 ParkVision. {t('public.footer.rights', 'All rights reserved.')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
