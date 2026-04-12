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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    { path: '/admin/dashboard', label: t('nav.dashboard'), icon: <DashboardIcon /> },
    {
      path: '/admin/shopping-centers',
      label: t('nav.shoppingCenters'),
      icon: <StorefrontIcon />,
    },
    { path: '/admin/map', label: t('nav.map'), icon: <MapIcon /> },
    { path: '/admin/admin-panel', label: t('nav.admin'), icon: <AdminPanelSettingsIcon /> },
  ];

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

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <LocalParkingIcon sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ParkVision MVP
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              color="inherit"
              onClick={handleLanguageClick}
              aria-label="Change language"
              aria-haspopup="true"
              aria-expanded={Boolean(langAnchorEl)}
            >
              <LanguageIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {actualTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* User Menu */}
            <IconButton
              color="inherit"
              onClick={handleUserMenuClick}
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={Boolean(userAnchorEl)}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
          </Stack>

          {/* Language Menu */}
          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLanguageClose}
            aria-label="Language selection menu"
          >
            <MenuItem
              onClick={() => handleLanguageChange('en')}
              selected={i18n.language === 'en'}
              aria-label="Switch to English"
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageChange('hu')}
              selected={i18n.language === 'hu'}
              aria-label="Switch to Hungarian"
            >
              Magyar
            </MenuItem>
          </Menu>

          {/* User Menu */}
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
        variant="permanent"
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
        <Box sx={{ overflow: 'auto' }}>
          <List role="navigation" aria-label="Main navigation">
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <ListItemIcon aria-hidden="true">{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} role="main">
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
