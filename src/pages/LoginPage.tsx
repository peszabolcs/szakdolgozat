import { useState, FormEvent, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/useAuth';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MotionCard = motion(Card);

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailError = useMemo(() => {
    if (!touched.email) return '';
    if (!email) return t('auth.errors.emailRequired');
    if (!EMAIL_REGEX.test(email)) return t('auth.errors.emailInvalid');
    return '';
  }, [email, touched.email, t]);

  const passwordError = useMemo(() => {
    if (!touched.password) return '';
    if (!password) return t('auth.errors.passwordRequired');
    if (password.length < 6) return t('auth.errors.passwordShort');
    return '';
  }, [password, touched.password, t]);

  const canSubmit =
    EMAIL_REGEX.test(email) && password.length >= 6 && !loading;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    setError(null);
    setErrorTitle(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.ok) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error.message);
        setErrorTitle(
          result.error.code === 'invalid_credentials'
            ? t('auth.errors.titleInvalid')
            : result.error.code === 'network'
              ? t('auth.errors.titleNetwork')
              : t('auth.errors.titleUnknown')
        );
      }
    } catch (_err) {
      setError(t('auth.loginError'));
      setErrorTitle(t('auth.errors.titleUnknown'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a464f 0%, #26313c 100%)'
            : 'linear-gradient(135deg, #e8f4f3 0%, #ffffff 50%, #fef3d8 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          sx={{ maxWidth: 460, mx: 'auto', overflow: 'visible' }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
                  mb: 2,
                  boxShadow: 4,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
                {t('auth.adminLogin')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('auth.loginPrompt')}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {errorTitle && (
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {errorTitle}
                  </Typography>
                )}
                <Typography variant="body2">{error}</Typography>
              </Alert>
            )}

            <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, email: true }))}
                required
                autoComplete="email"
                autoFocus
                error={!!emailError}
                helperText={emailError || ' '}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color={emailError ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, password: true }))}
                required
                autoComplete="current-password"
                error={!!passwordError}
                helperText={passwordError || ' '}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color={passwordError ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={showPassword ? 'Jelszó elrejtése' : 'Jelszó mutatása'}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!canSubmit}
                sx={{ py: 1.5, fontWeight: 700 }}
              >
                {loading ? t('auth.loggingIn') : t('auth.login')}
              </Button>
            </Stack>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 700 }}>
                {t('auth.demoCredentials')}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                admin@parkvision.hu / admin123
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                visitor@parkvision.hu / visitor123
              </Typography>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button size="small" onClick={() => navigate('/')}>
                {t('auth.backToHome')}
              </Button>
            </Box>
          </CardContent>
        </MotionCard>
      </Container>
    </Box>
  );
}
