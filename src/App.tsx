import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import i18n from './i18n/config';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ShoppingCentersPage from './pages/ShoppingCentersPage';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import PublicHomePage from './pages/PublicHomePage';
import ReservationsPage from './pages/ReservationsPage';
import ParkingSpacesPage from './pages/ParkingSpacesPage';
import SettingsPage from './pages/SettingsPage';
import ParkingDetailPage from './pages/ParkingDetailPage';
import AreasPage from './pages/AreasPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={4000}
        >
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<PublicHomePage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Admin Routes - Protected */}
                  <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="shopping-centers" element={<ShoppingCentersPage />} />
                    <Route path="centers/:id" element={<ParkingDetailPage />} />
                    <Route path="parking-spaces" element={<ParkingSpacesPage />} />
                    <Route path="areas" element={<AreasPage />} />
                    <Route path="map" element={<MapPage />} />
                    <Route path="reservations" element={<ReservationsPage />} />
                    <Route path="admin-panel" element={<AdminPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
              <PWAInstallPrompt />
              <OfflineIndicator />
            </AuthProvider>
          </QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
