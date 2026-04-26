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
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocalParkingTwoToneIcon from '@mui/icons-material/LocalParking';
import SettingsIcon from '@mui/icons-material/Settings';
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
import { useState } from 'react';

const drawerWidth = 240;

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

  const menuItems = [
    { path: '/admin/dashboard', label: t('nav.dashboard'), icon: <DashboardIcon /> },
    { path: '/admin/shopping-centers', label: t('nav.shoppingCenters'), icon: <StorefrontIcon /> },
    { path: '/admin/parking-spaces', label: t('nav.parkingSpaces'), icon: <LocalParkingTwoToneIcon /> },
    { path: '/admin/map', label: t('nav.map'), icon: <MapIcon /> },
    { path: '/admin/reservations', label: t('nav.reservations'), icon: <EventAvailableIcon /> },
    { path: '/admin/admin-panel', label: t('nav.admin'), icon: <AdminPanelSettingsIcon /> },
    { path: '/admin/settings', label: t('nav.settings'), icon: <SettingsIcon /> },
  ];

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
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      <List role="navigation" aria-label="Main navigation" sx={{ px: 1, pt: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={active}
                onClick={() => handleNavigate(item.path)}
                aria-label={`Navigate to ${item.label}`}
                aria-current={active ? 'page' : undefined}
                sx={{
                  borderRadius: 2,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  minHeight: 48,
                  '&.Mui-selected': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(61, 132, 146, 0.16)'
                        : 'rgba(38, 99, 111, 0.10)',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -8,
                      top: 8,
                      bottom: 8,
                      width: 4,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                    },
                  },
                  '&:hover': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(61, 132, 146, 0.10)'
                        : 'rgba(38, 99, 111, 0.06)',
                  },
                }}
              >
                <ListItemIcon aria-hidden="true" sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <LocalParkingIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            ParkVision
          </Typography>

          <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} alignItems="center">
            <IconButton
              color="inherit"
              onClick={handleLanguageClick}
              aria-label="Change language"
              aria-haspopup="true"
              aria-expanded={Boolean(langAnchorEl)}
              size={isMobile ? 'small' : 'medium'}
            >
              <LanguageIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
              size={isMobile ? 'small' : 'medium'}
            >
              {actualTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleUserMenuClick}
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={Boolean(userAnchorEl)}
              size={isMobile ? 'small' : 'medium'}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
          </Stack>

          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLanguageClose}
            aria-label="Language selection menu"
          >
            <MenuItem onClick={() => handleLanguageChange('en')} selected={i18n.language === 'en'}>
              English
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange('hu')} selected={i18n.language === 'hu'}>
              Magyar
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={userAnchorEl}
            open={Boolean(userAnchorEl)}
            onClose={handleUserMenuClose}
            aria-label="User menu"
          >
            <MenuItem disabled>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccountCircleIcon />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {user?.name || 'Admin'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
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
          },
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
        role="main"
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
