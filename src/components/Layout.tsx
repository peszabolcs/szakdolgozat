import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocalParkingTwoToneIcon from '@mui/icons-material/LocalParking';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../contexts/useThemeMode';
import { useAuth } from '../contexts/useAuth';
import { useState, ReactNode } from 'react';

const drawerWidth = 260;

interface MenuSection {
  label: string;
  items: Array<{ path: string; label: string; icon: ReactNode; mono?: string }>;
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { actualTheme, setMode } = useThemeMode();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);

  const isAdmin = user?.role === 'admin';

  const adminSections: MenuSection[] = [
    {
      label: '01 · Áttekintés',
      items: [
        { path: '/admin/dashboard', label: t('nav.dashboard'), icon: <DashboardIcon fontSize="small" />, mono: 'A·01' },
        { path: '/admin/map', label: t('nav.map'), icon: <MapIcon fontSize="small" />, mono: 'A·02' },
      ],
    },
    {
      label: '02 · Üzemeltetés',
      items: [
        { path: '/admin/shopping-centers', label: t('nav.shoppingCenters'), icon: <StorefrontIcon fontSize="small" />, mono: 'B·01' },
        { path: '/admin/parking-spaces', label: t('nav.parkingSpaces'), icon: <LocalParkingTwoToneIcon fontSize="small" />, mono: 'B·02' },
        { path: '/admin/areas', label: t('nav.areas', 'Zónák'), icon: <LocalParkingTwoToneIcon fontSize="small" />, mono: 'B·03' },
        { path: '/admin/reservations', label: t('nav.reservations'), icon: <EventAvailableIcon fontSize="small" />, mono: 'B·04' },
      ],
    },
    {
      label: '03 · Elemzés',
      items: [
        { path: '/admin/admin-panel', label: t('nav.admin'), icon: <AdminPanelSettingsIcon fontSize="small" />, mono: 'C·01' },
        { path: '/admin/settings', label: t('nav.settings'), icon: <SettingsIcon fontSize="small" />, mono: 'C·02' },
      ],
    },
  ];

  const visitorSections: MenuSection[] = [
    {
      label: '01 · Saját fiók',
      items: [
        { path: '/me', label: 'Áttekintés', icon: <PersonOutlineIcon fontSize="small" />, mono: 'M·01' },
        { path: '/me/reservations', label: 'Foglalásaim', icon: <EventAvailableIcon fontSize="small" />, mono: 'M·02' },
      ],
    },
    {
      label: '02 · Felfedezés',
      items: [
        { path: '/', label: 'Központok', icon: <HomeIcon fontSize="small" />, mono: 'P·01' },
        { path: '/me/map', label: 'Térkép', icon: <MapIcon fontSize="small" />, mono: 'P·02' },
      ],
    },
    {
      label: '03 · Beállítások',
      items: [
        { path: '/me/settings', label: t('nav.settings'), icon: <SettingsIcon fontSize="small" />, mono: 'S·01' },
      ],
    },
  ];

  const sections = isAdmin ? adminSections : visitorSections;

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => setLangAnchorEl(event.currentTarget);
  const handleLanguageClose = () => setLangAnchorEl(null);
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };
  const handleThemeToggle = () => setMode(actualTheme === 'dark' ? 'light' : 'dark');
  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => setUserAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand block */}
      <Box sx={{ px: 3, pt: 3.5, pb: 2.5, borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}` }}>
        <Typography
          className="pv-eyebrow"
          sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}
        >
          ParkVision · {isAdmin ? 'Admin konzol' : 'Saját fiók'}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 500,
            fontSize: '1.5rem',
            lineHeight: 1.1,
            letterSpacing: '-0.022em',
            color: 'text.primary',
          }}
        >
          {isAdmin ? (
            <>
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>Civic</Box>{' '}
              parking intelligence.
            </>
          ) : (
            <>
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>Üdv</Box>,{' '}
              {user?.name?.split(' ')[0] || 'Vendég'}.
            </>
          )}
        </Typography>
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            mt: 1.5,
            width: 36,
            height: 2,
            backgroundColor: 'secondary.main',
          }}
        />
      </Box>

      {/* Navigation sections */}
      <Box sx={{ overflow: 'auto', flex: 1, pt: 1 }} role="navigation" aria-label="Main navigation">
        {sections.map((section, sIdx) => (
          <Box key={section.label} sx={{ mt: sIdx === 0 ? 1.5 : 2.5, mb: 0.5 }}>
            <Typography
              className="pv-eyebrow"
              sx={{ display: 'block', px: 3, mb: 1, color: 'text.secondary' }}
            >
              {section.label}
            </Typography>
            <List sx={{ px: 1.5, py: 0 }}>
              {section.items.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                    <ListItemButton
                      selected={active}
                      onClick={() => handleNavigate(item.path)}
                      aria-current={active ? 'page' : undefined}
                      sx={{
                        borderRadius: 1,
                        position: 'relative',
                        pl: 2,
                        pr: 1.5,
                        py: 0.75,
                        minHeight: 38,
                        transition: 'background-color 180ms ease, color 180ms ease',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 6,
                          bottom: 6,
                          width: 3,
                          backgroundColor: active ? 'secondary.main' : 'transparent',
                          transition: 'background-color 180ms ease',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'transparent',
                          color: 'text.primary',
                          fontWeight: 700,
                          '& .MuiListItemIcon-root': { color: 'text.primary' },
                        },
                        '&:hover': {
                          bgcolor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.06 : 0.04),
                        },
                      }}
                    >
                      <ListItemIcon aria-hidden="true" sx={{ minWidth: 28, color: 'text.secondary' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          sx: { fontSize: '0.9375rem', fontWeight: active ? 700 : 500, letterSpacing: '-0.005em' },
                        }}
                      />
                      {item.mono && (
                        <Typography
                          className="pv-mono"
                          sx={{
                            fontSize: '0.625rem',
                            color: active ? 'secondary.main' : 'text.disabled',
                            letterSpacing: '0.08em',
                            ml: 1,
                          }}
                        >
                          {item.mono}
                        </Typography>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer signature */}
      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}` }}>
        <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.disabled', mb: 0.25 }}>
          Szakdolgozat · Szeged
        </Typography>
        <Typography
          className="pv-mono"
          sx={{ fontSize: '0.6875rem', color: 'text.secondary', letterSpacing: '0.04em' }}
        >
          Perjési Sz · 2026
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, md: 60 }, gap: 1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              sx={{ mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Compact wordmark, shown on mobile (sidebar shows the full one) */}
          {isMobile && (
            <Typography
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 500,
                fontSize: '1.125rem',
                letterSpacing: '-0.02em',
                color: 'text.primary',
                flexGrow: 1,
              }}
            >
              ParkVision
            </Typography>
          )}
          {!isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* Breadcrumb-like context indicator (desktop) */}
          {!isMobile && (
            <Typography
              className="pv-eyebrow"
              sx={{ mr: 'auto', ml: `${drawerWidth - 24}px`, color: 'text.secondary' }}
            >
              {location.pathname.replace('/admin/', '').replace(/-/g, ' ').toUpperCase() || 'DASHBOARD'}
            </Typography>
          )}

          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton
              onClick={handleLanguageClick}
              aria-label="Change language"
              aria-haspopup="true"
              aria-expanded={Boolean(langAnchorEl)}
              size="small"
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              <LanguageIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleThemeToggle}
              aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
              size="small"
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              {actualTheme === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>

            <Box
              component="button"
              onClick={handleUserMenuClick}
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={Boolean(userAnchorEl)}
              sx={{
                ml: 0.5,
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.16)}`,
                bgcolor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                transition: 'border-color 180ms, background-color 180ms',
                '&:hover': {
                  borderColor: theme.palette.text.primary,
                  bgcolor: alpha(theme.palette.text.primary, 0.04),
                },
              }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Box>
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {user?.role === 'admin' ? 'Admin' : 'Visitor'}
              </Typography>
            </Box>
          </Stack>

          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLanguageClose}
            aria-label="Language selection menu"
          >
            <MenuItem onClick={() => handleLanguageChange('hu')} selected={i18n.language === 'hu'}>
              Magyar
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange('en')} selected={i18n.language === 'en'}>
              English
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={userAnchorEl}
            open={Boolean(userAnchorEl)}
            onClose={handleUserMenuClose}
            aria-label="User menu"
          >
            <MenuItem disabled>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 0.5 }}>
                <AccountCircleIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {user?.name || 'Admin'}
                  </Typography>
                  <Typography className="pv-mono" sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>
                    {user?.email || 'admin@parkvision.hu'}
                  </Typography>
                </Box>
              </Stack>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleUserMenuClose();
                navigate('/admin/settings');
              }}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('nav.settings')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('auth.logout')}</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.mode === 'dark' ? '#11161394'.slice(0, 7) : theme.palette.background.paper,
          },
        }}
      >
        {!isMobile && <Toolbar sx={{ minHeight: { xs: 56, md: 60 } }} />}
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          maxWidth: '100%',
        }}
        role="main"
      >
        <Toolbar sx={{ minHeight: { xs: 56, md: 60 } }} />
        <Outlet />
      </Box>
    </Box>
  );
}
