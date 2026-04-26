import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Avatar,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/useAuth';

const PROFILE_KEY = 'parkvision.profile.preferences.v1';

interface Preferences {
  notifyEmail: boolean;
  notifyPush: boolean;
  notifyOccupancyAlert: boolean;
  defaultPaymentMethod: 'card' | 'paypal' | 'invoice';
  cardLast4: string;
  preferredCenters: string[];
}

const DEFAULT_PREFS: Preferences = {
  notifyEmail: true,
  notifyPush: false,
  notifyOccupancyAlert: true,
  defaultPaymentMethod: 'card',
  cardLast4: '4242',
  preferredCenters: [],
};

function loadPrefs(): Preferences {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Preferences) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [prefs, setPrefs] = useState<Preferences>(() => loadPrefs());
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('+36 30 123 4567');

  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(prefs));
    enqueueSnackbar(t('settings.toast.saved'), { variant: 'success' });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        {t('settings.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('settings.subtitle')}
      </Typography>

      <Stack spacing={3} sx={{ maxWidth: 800 }}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t('settings.profile.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.profile.subtitle')}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <TextField label={t('settings.profile.name')} value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <TextField label={t('settings.profile.email')} value={user?.email ?? ''} disabled fullWidth helperText={t('settings.profile.emailLocked')} />
              <TextField label={t('settings.profile.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('settings.profile.role')}
                </Typography>
                <Chip label={user?.role === 'admin' ? 'Admin' : 'Visitor'} color="primary" size="small" sx={{ mt: 0.5 }} />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                <NotificationsActiveIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t('settings.notifications.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.notifications.subtitle')}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>
              <FormControlLabel
                control={<Switch checked={prefs.notifyEmail} onChange={(_, v) => update('notifyEmail', v)} />}
                label={t('settings.notifications.email')}
              />
              <FormControlLabel
                control={<Switch checked={prefs.notifyPush} onChange={(_, v) => update('notifyPush', v)} />}
                label={t('settings.notifications.push')}
              />
              <FormControlLabel
                control={<Switch checked={prefs.notifyOccupancyAlert} onChange={(_, v) => update('notifyOccupancyAlert', v)} />}
                label={t('settings.notifications.occupancyAlert')}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                <CreditCardIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t('settings.payment.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.payment.subtitle')}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {(['card', 'paypal', 'invoice'] as const).map((method) => (
                <Chip
                  key={method}
                  label={t(`settings.payment.methods.${method}`)}
                  color={prefs.defaultPaymentMethod === method ? 'primary' : 'default'}
                  variant={prefs.defaultPaymentMethod === method ? 'filled' : 'outlined'}
                  onClick={() => update('defaultPaymentMethod', method)}
                  clickable
                />
              ))}
            </Stack>
            {prefs.defaultPaymentMethod === 'card' && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" icon={<SecurityIcon />}>
                  {t('settings.payment.cardInfo', { last4: prefs.cardLast4 })}
                </Alert>
              </Box>
            )}
          </CardContent>
        </Card>

        <Box sx={{ position: 'sticky', bottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" size="large" onClick={handleSave}>
            {t('settings.save')}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
