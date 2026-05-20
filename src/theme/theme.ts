import { createTheme, alpha } from '@mui/material';

/* =============================================================
 * ParkVision — Civic Data Editorial Theme
 * =============================================================
 * Reference: src/styles/design-tokens.css
 *
 * Light surfaces are warm linen (cream / paper), dark surfaces
 * deep ink with moss undertone. The single accent is burnt
 * saffron — used for live indicators, primary actions, and
 * editorial rules.
 * ============================================================= */

const fontDisplay = '"Fraunces", "Times New Roman", serif';
const fontSans = '"Bricolage Grotesque", system-ui, -apple-system, sans-serif';
const fontMono = '"JetBrains Mono", ui-monospace, Menlo, monospace';

/* Brand tokens, kept in JS so palette() references stay literal */
const brand = {
  ink: '#0F1B17',
  inkSoft: '#1A2520',
  moss: '#2D4A3E',
  mossLight: '#5B7A6E',
  sage: '#8AAF9C',
  bone: '#F5F1E8',
  paper: '#FBF8F1',
  paperWarm: '#F0EAD9',
  iron: '#525B5A',
  saffron: '#D97706',
  saffronDeep: '#B45309',
  saffronSoft: '#F5D199',
  success: '#65A30D',
  warning: '#D97706',
  danger: '#C2410C',
};

const editorialTypography = {
  fontFamily: fontSans,
  h1: {
    fontFamily: fontDisplay,
    fontWeight: 400,
    fontSize: 'clamp(2.75rem, 6vw, 4.75rem)',
    lineHeight: 1.02,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontFamily: fontDisplay,
    fontWeight: 400,
    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
    lineHeight: 1.05,
    letterSpacing: '-0.022em',
  },
  h3: {
    fontFamily: fontDisplay,
    fontWeight: 500,
    fontSize: 'clamp(1.5rem, 2.4vw, 2.125rem)',
    lineHeight: 1.12,
    letterSpacing: '-0.018em',
  },
  h4: {
    fontFamily: fontSans,
    fontWeight: 600,
    fontSize: '1.375rem',
    lineHeight: 1.2,
    letterSpacing: '-0.012em',
  },
  h5: {
    fontFamily: fontSans,
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.25,
    letterSpacing: '-0.008em',
  },
  h6: {
    fontFamily: fontSans,
    fontWeight: 600,
    fontSize: '0.9375rem',
    lineHeight: 1.3,
    letterSpacing: '0',
  },
  subtitle1: {
    fontFamily: fontSans,
    fontSize: '1.0625rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  subtitle2: {
    fontFamily: fontSans,
    fontSize: '0.875rem',
    lineHeight: 1.4,
    fontWeight: 500,
  },
  body1: {
    fontFamily: fontSans,
    fontSize: '1rem',
    lineHeight: 1.6,
    fontWeight: 400,
  },
  body2: {
    fontFamily: fontSans,
    fontSize: '0.9375rem',
    lineHeight: 1.55,
    fontWeight: 400,
  },
  caption: {
    fontFamily: fontMono,
    fontSize: '0.6875rem',
    lineHeight: 1.4,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    fontWeight: 500,
  },
  overline: {
    fontFamily: fontMono,
    fontSize: '0.6875rem',
    lineHeight: 1.4,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    fontWeight: 500,
  },
  button: {
    fontFamily: fontSans,
    textTransform: 'none' as const,
    fontWeight: 600,
    letterSpacing: '-0.005em',
    fontSize: '0.9375rem',
  },
};

/* ---------- LIGHT ---------- */
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.ink,
      light: brand.inkSoft,
      dark: '#000000',
      contrastText: brand.bone,
    },
    secondary: {
      main: brand.saffron,
      light: brand.saffronSoft,
      dark: brand.saffronDeep,
      contrastText: brand.ink,
    },
    success: {
      main: brand.success,
      light: '#84cc16',
      dark: '#4d7c0f',
      contrastText: '#ffffff',
    },
    warning: {
      main: brand.saffron,
      light: brand.saffronSoft,
      dark: brand.saffronDeep,
      contrastText: brand.ink,
    },
    error: {
      main: brand.danger,
      light: '#ea580c',
      dark: '#9a3412',
      contrastText: '#ffffff',
    },
    info: {
      main: brand.moss,
      light: brand.mossLight,
      dark: '#1a2f25',
      contrastText: brand.bone,
    },
    background: {
      default: brand.bone,
      paper: brand.paper,
    },
    text: {
      primary: brand.ink,
      secondary: brand.iron,
      disabled: '#8c8f8d',
    },
    divider: alpha(brand.ink, 0.12),
  },
  typography: editorialTypography,
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 0 rgba(15, 27, 23, 0.06), 0 1px 2px rgba(15, 27, 23, 0.05)',
    '0 1px 0 rgba(15, 27, 23, 0.06), 0 2px 4px rgba(15, 27, 23, 0.06)',
    '0 2px 0 rgba(15, 27, 23, 0.04), 0 6px 14px -6px rgba(15, 27, 23, 0.15)',
    '0 2px 0 rgba(15, 27, 23, 0.04), 0 8px 20px -6px rgba(15, 27, 23, 0.18)',
    '0 4px 0 rgba(15, 27, 23, 0.03), 0 12px 24px -8px rgba(15, 27, 23, 0.2)',
    '0 12px 30px -10px rgba(15, 27, 23, 0.25)',
    '0 16px 36px -10px rgba(15, 27, 23, 0.28)',
    '0 20px 40px -12px rgba(15, 27, 23, 0.3)',
    '0 24px 48px -12px rgba(15, 27, 23, 0.32)',
    '0 28px 56px -14px rgba(15, 27, 23, 0.34)',
    '0 32px 64px -16px rgba(15, 27, 23, 0.36)',
    '0 36px 72px -18px rgba(15, 27, 23, 0.38)',
    '0 40px 80px -20px rgba(15, 27, 23, 0.4)',
    '0 44px 88px -22px rgba(15, 27, 23, 0.42)',
    '0 48px 96px -24px rgba(15, 27, 23, 0.44)',
    '0 52px 104px -26px rgba(15, 27, 23, 0.46)',
    '0 56px 112px -28px rgba(15, 27, 23, 0.48)',
    '0 60px 120px -30px rgba(15, 27, 23, 0.5)',
    '0 64px 128px -32px rgba(15, 27, 23, 0.52)',
    '0 68px 136px -34px rgba(15, 27, 23, 0.54)',
    '0 72px 144px -36px rgba(15, 27, 23, 0.56)',
    '0 76px 152px -38px rgba(15, 27, 23, 0.58)',
    '0 80px 160px -40px rgba(15, 27, 23, 0.6)',
    '0 84px 168px -42px rgba(15, 27, 23, 0.62)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brand.bone,
          color: brand.ink,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '0.65rem 1.25rem',
          fontWeight: 600,
          letterSpacing: '-0.005em',
          transition: 'background-color 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 220ms, color 220ms, transform 220ms',
          '&:hover': { transform: 'translateY(-1px)' },
        },
        contained: {
          backgroundColor: brand.ink,
          color: brand.bone,
          border: `2px solid ${brand.ink}`,
          '&:hover': {
            backgroundColor: brand.saffron,
            borderColor: brand.saffron,
            color: brand.ink,
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: brand.ink,
          color: brand.ink,
          '&:hover': {
            borderWidth: 2,
            borderColor: brand.saffron,
            color: brand.saffron,
            backgroundColor: 'transparent',
          },
        },
        text: {
          color: brand.ink,
          '&:hover': { backgroundColor: alpha(brand.ink, 0.05), color: brand.saffronDeep },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: brand.paper,
          border: `1px solid ${alpha(brand.ink, 0.12)}`,
          boxShadow: '0 1px 0 rgba(15, 27, 23, 0.04)',
          transition: 'border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease',
          '&:hover': {
            borderColor: alpha(brand.ink, 0.24),
            boxShadow: '0 2px 0 rgba(15, 27, 23, 0.04), 0 6px 14px -6px rgba(15, 27, 23, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none', borderRadius: 8 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: {
          backgroundColor: alpha(brand.bone, 0.92),
          backdropFilter: 'saturate(140%) blur(8px)',
          borderBottom: `1px solid ${alpha(brand.ink, 0.12)}`,
          color: brand.ink,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: brand.paper,
          borderRight: `1px solid ${alpha(brand.ink, 0.12)}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: brand.paper,
          '& fieldset': { borderColor: alpha(brand.ink, 0.18), borderWidth: 1 },
          '&:hover fieldset': { borderColor: alpha(brand.ink, 0.36) },
          '&.Mui-focused fieldset': { borderColor: brand.ink, borderWidth: 2 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          fontFamily: fontSans,
          letterSpacing: '-0.005em',
          fontSize: '0.8125rem',
        },
        outlined: { borderWidth: 1.5 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: fontSans,
          letterSpacing: '-0.005em',
          minHeight: 44,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: brand.ink,
          color: brand.bone,
          fontFamily: fontMono,
          fontSize: '0.75rem',
          borderRadius: 4,
        },
        arrow: { color: brand.ink },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          border: `1px solid ${alpha(brand.ink, 0.12)}`,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 0,
          backgroundColor: alpha(brand.ink, 0.1),
        },
        bar: {
          borderRadius: 0,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha(brand.ink, 0.08),
          fontFamily: fontSans,
        },
        head: {
          fontFamily: fontMono,
          fontSize: '0.6875rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: brand.iron,
          fontWeight: 500,
          borderBottom: `2px solid ${brand.ink}`,
        },
      },
    },
  },
});

/* ---------- DARK ---------- */
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: brand.bone,
      light: '#ffffff',
      dark: '#d4cfc1',
      contrastText: brand.ink,
    },
    secondary: {
      main: brand.saffron,
      light: brand.saffronSoft,
      dark: brand.saffronDeep,
      contrastText: brand.ink,
    },
    success: {
      main: '#84cc16',
      light: '#a3e635',
      dark: brand.success,
      contrastText: brand.ink,
    },
    warning: {
      main: brand.saffron,
      light: brand.saffronSoft,
      dark: brand.saffronDeep,
      contrastText: brand.ink,
    },
    error: {
      main: '#fb923c',
      light: '#fdba74',
      dark: brand.danger,
      contrastText: brand.ink,
    },
    info: {
      main: brand.sage,
      light: '#a8c4b6',
      dark: brand.mossLight,
      contrastText: brand.ink,
    },
    background: {
      default: '#0A0E0C',
      paper: '#1D231F',
    },
    text: {
      primary: '#E8E4D8',
      secondary: '#A8ACA6',
      disabled: '#6B6F6A',
    },
    divider: alpha('#E8E4D8', 0.12),
  },
  typography: editorialTypography,
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0A0E0C',
          color: '#E8E4D8',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '0.65rem 1.25rem',
          fontWeight: 600,
          letterSpacing: '-0.005em',
          transition: 'background-color 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 220ms, color 220ms, transform 220ms',
          '&:hover': { transform: 'translateY(-1px)' },
        },
        contained: {
          backgroundColor: '#E8E4D8',
          color: brand.ink,
          border: '2px solid #E8E4D8',
          '&:hover': {
            backgroundColor: brand.saffron,
            borderColor: brand.saffron,
            color: brand.ink,
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#E8E4D8',
          color: '#E8E4D8',
          '&:hover': {
            borderWidth: 2,
            borderColor: brand.saffron,
            color: brand.saffron,
            backgroundColor: 'transparent',
          },
        },
        text: {
          color: '#E8E4D8',
          '&:hover': { backgroundColor: alpha('#E8E4D8', 0.06), color: brand.saffron },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#1D231F',
          border: `1px solid ${alpha('#E8E4D8', 0.1)}`,
          boxShadow: 'none',
          transition: 'border-color 220ms ease, box-shadow 220ms ease',
          '&:hover': {
            borderColor: alpha('#E8E4D8', 0.22),
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none', borderRadius: 8 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0A0E0C', 0.92),
          backdropFilter: 'saturate(140%) blur(8px)',
          borderBottom: `1px solid ${alpha('#E8E4D8', 0.1)}`,
          color: '#E8E4D8',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#11161394'.slice(0, 7), // strip alpha for solid drawer
          borderRight: `1px solid ${alpha('#E8E4D8', 0.1)}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#161B18',
          '& fieldset': { borderColor: alpha('#E8E4D8', 0.18), borderWidth: 1 },
          '&:hover fieldset': { borderColor: alpha('#E8E4D8', 0.36) },
          '&.Mui-focused fieldset': { borderColor: '#E8E4D8', borderWidth: 2 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          fontFamily: fontSans,
          letterSpacing: '-0.005em',
          fontSize: '0.8125rem',
        },
        outlined: { borderWidth: 1.5 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: fontSans,
          letterSpacing: '-0.005em',
          minHeight: 44,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#E8E4D8',
          color: brand.ink,
          fontFamily: fontMono,
          fontSize: '0.75rem',
          borderRadius: 4,
        },
        arrow: { color: '#E8E4D8' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 0,
          backgroundColor: alpha('#E8E4D8', 0.12),
        },
        bar: { borderRadius: 0 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha('#E8E4D8', 0.08),
          fontFamily: fontSans,
        },
        head: {
          fontFamily: fontMono,
          fontSize: '0.6875rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#A8ACA6',
          fontWeight: 500,
          borderBottom: `2px solid #E8E4D8`,
        },
      },
    },
  },
});

/* Re-export brand tokens for non-MUI consumers. */
export const tokens = brand;
