import { createTheme, alpha } from '@mui/material';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#26636f',
      light: '#3d8492',
      dark: '#1a464f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f9a825',
      light: '#fab84d',
      dark: '#c17a00',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00897b',
      light: '#33a498',
      dark: '#005f56',
    },
    warning: {
      main: '#f9a825',
      light: '#fab84d',
      dark: '#c17a00',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f5f7f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.15)',
    '0 2px 4px rgb(0 0 0 / 0.08), 0 4px 8px rgb(0 0 0 / 0.06)',
    '0 4px 8px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.06)',
    '0 8px 16px rgb(0 0 0 / 0.12), 0 4px 8px rgb(0 0 0 / 0.08)',
    '0 12px 24px rgb(0 0 0 / 0.14), 0 6px 12px rgb(0 0 0 / 0.1)',
    '0 16px 32px rgb(0 0 0 / 0.16), 0 8px 16px rgb(0 0 0 / 0.12)',
    '0 20px 40px rgb(0 0 0 / 0.18), 0 10px 20px rgb(0 0 0 / 0.14)',
    '0 24px 48px rgb(0 0 0 / 0.2), 0 12px 24px rgb(0 0 0 / 0.16)',
    '0 28px 56px rgb(0 0 0 / 0.22), 0 14px 28px rgb(0 0 0 / 0.18)',
    '0 32px 64px rgb(0 0 0 / 0.24), 0 16px 32px rgb(0 0 0 / 0.2)',
    '0 36px 72px rgb(0 0 0 / 0.26), 0 18px 36px rgb(0 0 0 / 0.22)',
    '0 40px 80px rgb(0 0 0 / 0.28), 0 20px 40px rgb(0 0 0 / 0.24)',
    '0 44px 88px rgb(0 0 0 / 0.3), 0 22px 44px rgb(0 0 0 / 0.26)',
    '0 48px 96px rgb(0 0 0 / 0.32), 0 24px 48px rgb(0 0 0 / 0.28)',
    '0 52px 104px rgb(0 0 0 / 0.34), 0 26px 52px rgb(0 0 0 / 0.3)',
    '0 56px 112px rgb(0 0 0 / 0.36), 0 28px 56px rgb(0 0 0 / 0.32)',
    '0 60px 120px rgb(0 0 0 / 0.38), 0 30px 60px rgb(0 0 0 / 0.34)',
    '0 64px 128px rgb(0 0 0 / 0.4), 0 32px 64px rgb(0 0 0 / 0.36)',
    '0 68px 136px rgb(0 0 0 / 0.42), 0 34px 68px rgb(0 0 0 / 0.38)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #26636f 0%, #00897b 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1a464f 0%, #005f56 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          backdropFilter: 'blur(10px)',
          background: alpha('#ffffff', 0.95),
          border: `1px solid ${alpha('#26636f', 0.08)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3d8492',
      light: '#5fa1ae',
      dark: '#26636f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fab84d',
      light: '#fcc975',
      dark: '#f9a825',
      contrastText: '#000000',
    },
    success: {
      main: '#33a498',
      light: '#5cb8ad',
      dark: '#00897b',
    },
    warning: {
      main: '#fab84d',
      light: '#fcc975',
      dark: '#f9a825',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#ef4444',
    },
    background: {
      default: '#1a2630',
      paper: '#26313c',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.5)',
    '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
    '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
    '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
    '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.6)',
    '0 2px 4px rgb(0 0 0 / 0.4), 0 4px 8px rgb(0 0 0 / 0.3)',
    '0 4px 8px rgb(0 0 0 / 0.45), 0 2px 4px rgb(0 0 0 / 0.35)',
    '0 8px 16px rgb(0 0 0 / 0.5), 0 4px 8px rgb(0 0 0 / 0.4)',
    '0 12px 24px rgb(0 0 0 / 0.55), 0 6px 12px rgb(0 0 0 / 0.45)',
    '0 16px 32px rgb(0 0 0 / 0.6), 0 8px 16px rgb(0 0 0 / 0.5)',
    '0 20px 40px rgb(0 0 0 / 0.65), 0 10px 20px rgb(0 0 0 / 0.55)',
    '0 24px 48px rgb(0 0 0 / 0.7), 0 12px 24px rgb(0 0 0 / 0.6)',
    '0 28px 56px rgb(0 0 0 / 0.72), 0 14px 28px rgb(0 0 0 / 0.62)',
    '0 32px 64px rgb(0 0 0 / 0.74), 0 16px 32px rgb(0 0 0 / 0.64)',
    '0 36px 72px rgb(0 0 0 / 0.76), 0 18px 36px rgb(0 0 0 / 0.66)',
    '0 40px 80px rgb(0 0 0 / 0.78), 0 20px 40px rgb(0 0 0 / 0.68)',
    '0 44px 88px rgb(0 0 0 / 0.8), 0 22px 44px rgb(0 0 0 / 0.7)',
    '0 48px 96px rgb(0 0 0 / 0.82), 0 24px 48px rgb(0 0 0 / 0.72)',
    '0 52px 104px rgb(0 0 0 / 0.84), 0 26px 52px rgb(0 0 0 / 0.74)',
    '0 56px 112px rgb(0 0 0 / 0.86), 0 28px 56px rgb(0 0 0 / 0.76)',
    '0 60px 120px rgb(0 0 0 / 0.88), 0 30px 60px rgb(0 0 0 / 0.78)',
    '0 64px 128px rgb(0 0 0 / 0.9), 0 32px 64px rgb(0 0 0 / 0.8)',
    '0 68px 136px rgb(0 0 0 / 0.92), 0 34px 68px rgb(0 0 0 / 0.82)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #3d8492 0%, #33a498 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #26636f 0%, #00897b 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
          backdropFilter: 'blur(20px)',
          background: alpha('#26313c', 0.95),
          border: `1px solid ${alpha('#3d8492', 0.15)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
        },
      },
    },
  },
});
