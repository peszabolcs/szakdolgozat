import { useState, FormEvent, useMemo } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  LinearProgress,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/useAuth';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function scorePassword(pw: string): { score: number; label: string; color: 'error' | 'warning' | 'info' | 'success' } {
  let score = 0;
  if (pw.length >= 8) score += 25;
  if (pw.length >= 12) score += 15;
  if (/[a-z]/.test(pw)) score += 10;
  if (/[A-Z]/.test(pw)) score += 15;
  if (/\d/.test(pw)) score += 15;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 20;
  if (score < 30) return { score, label: 'Gyenge', color: 'error' };
  if (score < 60) return { score, label: 'Közepes', color: 'warning' };
  if (score < 85) return { score, label: 'Jó', color: 'info' };
  return { score, label: 'Erős', color: 'success' };
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, name: false, password: false });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pwScore = useMemo(() => scorePassword(password), [password]);

  const emailError = useMemo(() => {
    if (!touched.email) return '';
    if (!email) return t('auth.errors.emailRequired');
    if (!EMAIL_REGEX.test(email)) return t('auth.errors.emailInvalid');
    return '';
  }, [email, touched.email, t]);

  const nameError = useMemo(() => {
    if (!touched.name) return '';
    if (!name.trim()) return 'A név megadása kötelező';
    return '';
  }, [name, touched.name]);

  const passwordError = useMemo(() => {
    if (!touched.password) return '';
    if (!password) return t('auth.errors.passwordRequired');
    if (password.length < 8) return 'Legalább 8 karakter';
    return '';
  }, [password, touched.password, t]);

  const canSubmit = EMAIL_REGEX.test(email) && name.trim().length > 0 && password.length >= 8 && !loading;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, name: true, password: true });
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const result = await register(email, password, name);
      if (result.ok) {
        // New registrations are always visitor role → land on personal account page.
        navigate('/me');
      } else {
        setError(result.error.message);
      }
    } catch {
      setError('Ismeretlen hiba történt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
        bgcolor: 'background.default',
      }}
    >
      {/* === LEFT: brand manifesto === */}
      <Box
        sx={(theme) => ({
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { md: 5, lg: 7 },
          backgroundColor: theme.palette.mode === 'dark' ? '#0A0E0C' : '#0F1B17',
          color: '#F5F1E8',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(245,241,232,0.04) 1px, transparent 0)',
            backgroundSize: '4px 4px',
          },
        })}
      >
        <Box sx={{ position: 'relative' }}>
          <Stack direction="row" alignItems="baseline" spacing={1.5}>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 500, fontSize: '1.5rem', letterSpacing: '-0.022em' }}>
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>Park</Box>Vision
            </Typography>
            <Box className="pv-mono" sx={{ fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.5 }}>
              · v0.4
            </Box>
          </Stack>
        </Box>

        <Box sx={{ position: 'relative', maxWidth: 520 }}>
          <Typography className="pv-eyebrow" sx={{ display: 'block', mb: 2.5, color: alpha('#F5F1E8', 0.6) }}>
            № 02 · Új fiók
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 400,
              fontSize: { md: '3rem', lg: '3.5rem' },
              lineHeight: 1.05,
              letterSpacing: '-0.026em',
              mb: 3.5,
            }}
          >
            <Box component="span" sx={{ fontStyle: 'italic', color: '#D97706' }}>Foglalj</Box> egy kattintással. Élő foglaltság. Garantált férőhely.
          </Typography>

          <Box sx={{ width: 36, height: 2, bgcolor: '#D97706', mb: 2.5 }} />

          <Stack spacing={1.5} sx={{ fontSize: '0.9375rem', color: alpha('#F5F1E8', 0.8) }}>
            <FeatureLine label="Valós idejű adatok 30 mp-enként" />
            <FeatureLine label="Statisztikai foglaltsági előrejelzés" />
            <FeatureLine label="Foglalás múltbéli idősoros mintázat alapján" />
            <FeatureLine label="Kétnyelvű felület, sötét és világos téma" />
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing={3}
          sx={{
            position: 'relative',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.6875rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: alpha('#F5F1E8', 0.45),
          }}
        >
          <span>© 2026</span>
          <span>·</span>
          <span>Perjési Szabolcs</span>
          <span>·</span>
          <span>SzTE</span>
        </Stack>
      </Box>

      {/* === RIGHT: form === */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, sm: 5, md: 6, lg: 8 },
          maxWidth: 560,
          width: '100%',
          mx: 'auto',
        }}
      >
        <Box className="pv-reveal pv-reveal-1" sx={{ mb: { xs: 4, md: 5 } }}>
          <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1.5 }}>
            Regisztráció
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 400,
              fontSize: { xs: '2.25rem', md: '2.75rem' },
              lineHeight: 1.05,
              letterSpacing: '-0.024em',
              color: 'text.primary',
              mb: 1,
            }}
          >
            Csatlakozz <Box component="span" sx={{ fontStyle: 'italic' }}>most</Box>.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            30 másodperc, és kész a fiókod. Nincs kreditkártya.
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 0.5, border: '1px solid', borderColor: 'error.main' }}
            onClose={() => setError(null)}
          >
            <Typography variant="body2">{error}</Typography>
          </Alert>
        )}

        <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate className="pv-reveal pv-reveal-2">
          <Box>
            <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
              Név
            </Typography>
            <TextField
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, name: true }))}
              required
              autoComplete="name"
              autoFocus
              error={!!nameError}
              helperText={nameError || ' '}
              placeholder="Teljes név"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlinedIcon fontSize="small" color={nameError ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, email: true }))}
              required
              autoComplete="email"
              error={!!emailError}
              helperText={emailError || ' '}
              placeholder="te@example.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" color={emailError ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography className="pv-eyebrow" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
              Jelszó
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, password: true }))}
              required
              autoComplete="new-password"
              error={!!passwordError}
              helperText={passwordError || 'Legalább 8 karakter'}
              placeholder="••••••••"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" color={passwordError ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                      aria-label={showPassword ? 'Jelszó elrejtése' : 'Jelszó mutatása'}
                    >
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {password.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(pwScore.score, 100)}
                  color={pwScore.color}
                  sx={{ height: 4, borderRadius: 0 }}
                />
                <Typography
                  className="pv-mono"
                  sx={{
                    mt: 0.5,
                    fontSize: '0.6875rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: `${pwScore.color}.main`,
                    fontWeight: 700,
                  }}
                >
                  Jelszó erősség · {pwScore.label}
                </Typography>
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!canSubmit}
            endIcon={<ArrowOutwardIcon />}
            sx={{ py: 1.5, fontSize: '0.9375rem', justifyContent: 'space-between', mt: 1 }}
          >
            {loading ? 'Regisztráció…' : 'Fiók létrehozása'}
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'space-between' }}>
          <Button size="small" onClick={() => navigate('/')} sx={{ color: 'text.secondary' }}>
            ← Vissza a főoldalra
          </Button>
          <Button size="small" onClick={() => navigate('/login')} sx={{ color: 'secondary.dark' }}>
            Már van fiókod? Bejelentkezés →
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function FeatureLine({ label }: { label: string }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="baseline">
      <Box
        className="pv-mono"
        sx={{ color: '#D97706', fontSize: '0.875rem', letterSpacing: '0.08em' }}
      >
        ▸
      </Box>
      <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>{label}</Typography>
    </Stack>
  );
}
