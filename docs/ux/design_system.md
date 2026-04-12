# Design System — ParkVision

## UI / Komponens könyvtár

| Könyvtár | Verzió | Szerep |
|----------|--------|--------|
| Material-UI (MUI) | 5.14.0 | Alap UI komponens könyvtár |
| @mui/icons-material | 5.14.0 | Ikon készlet |
| Framer Motion | — | Kártya hover animációk, page transition |
| Recharts | — | Analitikai grafikonok (area, bar, pie) |
| Leaflet + React-Leaflet | — | Interaktív térkép |

Forrás: `package.json`, `src/theme/theme.ts`, `src/contexts/ThemeContext.tsx`

---

## Sötét mód

**Támogatott — teljes dual-theme implementáció.**

- Három mód: `light` | `dark` | `auto` (rendszer preferencia)
- Tárolás: `localStorage` (böngésző újraindítás után is megmarad)
- Automatikus váltás: `window.matchMedia('prefers-color-scheme')` figyelése valós időben
- Forrás: `src/contexts/ThemeContext.tsx`

---

## Színpaletta

### Világos téma (light)

| Szerep | Hex | Megjegyzés |
|--------|-----|------------|
| Primary main | `#26636f` | Sötét teal — fő brand szín |
| Primary light | `#3d8492` | Hover / contained hover |
| Primary dark | `#1a464f` | Mélység / árnyék |
| Secondary main | `#f9a825` | Amber — kiemelések, warning |
| Secondary light | `#fab84d` | |
| Secondary dark | `#c17a00` | |
| Success main | `#00897b` | Szabad állapot (zöld chip, progress bar) |
| Success light | `#33a498` | |
| Success dark | `#005f56` | |
| Error main | `#ef4444` | Foglalt állapot, hibaüzenetek |
| Error light | `#f87171` | |
| Error dark | `#dc2626` | |
| Warning main | `#f9a825` | Közepes kihasználtság |
| Warning light | `#fab84d` | |
| Warning dark | `#c17a00` | |
| Background default | `#f5f7f8` | Oldal háttér |
| Background paper | `#ffffff` | Kártyák, papír felületek |
| Text primary | `#0f172a` | Fő szöveg |
| Text secondary | `#475569` | Másodlagos szöveg, leírások |

### Sötét téma (dark)

| Szerep | Hex | Megjegyzés |
|--------|-----|------------|
| Primary main | `#3d8492` | Világosabb teal (kontraszthoz) |
| Primary light | `#5fa1ae` | |
| Primary dark | `#26636f` | |
| Secondary main | `#fab84d` | Világosabb amber |
| Secondary light | `#fcc975` | |
| Secondary dark | `#f9a825` | |
| Success main | `#33a498` | |
| Error main | `#f87171` | |
| Warning main | `#fab84d` | |
| Background default | `#1a2630` | Sötét kék-szürke |
| Background paper | `#26313c` | Kártyák sötét módban |
| Text primary | `#f1f5f9` | Világos szöveg |
| Text secondary | `#cbd5e1` | |

---

## Tipográfia

**Font família:** `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`

| Variant | Font size | Font weight | Letter spacing |
|---------|-----------|-------------|----------------|
| h1 | 2.5rem | 800 | −0.02em |
| h2 | 2rem | 700 | −0.01em |
| h3 | 1.5rem | 600 | — |
| h4 | 1.25rem | 600 | — |
| h5 | 1.125rem | 600 | — |
| h6 | 1rem | 600 | — |
| button | 0.95rem | 600 | — |

**Button extra:** `textTransform: none` (nem csupa nagybetű)

---

## Spacing & Grid

**Alap egység:** 8px (MUI alapértelmezett)

| Szorzó | px érték | Tipikus használat |
|--------|----------|-------------------|
| 0.5 | 4px | Mikro rés |
| 1 | 8px | Belső padding |
| 1.5 | 12px | Kis rés |
| 2 | 16px | Standard padding |
| 3 | 24px | Kártyák közötti rés (Grid spacing={3}) |
| 4 | 32px | Szekciók közötti rés |
| 6 | 48px | Nagy section padding |

**Max content width:** MUI Container alapértelmezett (~1200px)

**Grid minták:**
- 4-oszlopos: `xs={12} sm={6} md={3}` (StatCard-ok)
- 5-oszlopos: `xs={12} sm={6} md={2.4}` (sűrűbb layout)
- 3-oszlopos: `xs={12} md={6} lg={4}` (területkártyák)

---

## Border Radius

| Elem | Érték |
|------|-------|
| Alap (shape) | 12px |
| Kártya (MuiCard override) | 16px |
| Gomb (MuiButton override) | 10px |

---

## Komponens overrides

### MuiButton
- `padding: 10px 24px`
- `fontSize: 0.95rem`
- `boxShadow: none` alapból
- Hover: `boxShadow: 0 4px 12px rgba(0,0,0,0.15)`, `translateY(-1px)`
- `transition: all 0.2s ease-in-out`
- Contained variáns light: `linear-gradient(135deg, #26636f → #00897b)`
- Contained variáns dark: `linear-gradient(135deg, #3d8492 → #33a498)`

### MuiCard
- `borderRadius: 16px`
- `backdropFilter: blur(10px)` light / `blur(20px)` dark
- `background: alpha('#ffffff', 0.95)` light / `alpha('#26313c', 0.95)` dark
- `border: 1px solid alpha(primary, 0.08)` light / `alpha(primary, 0.15)` dark

### MuiPaper
- `backgroundImage: none` (MUI dark mode gradient kikapcsolva)
- elevation1 egyedi shadow

---

## Reszponzív breakpointok

| Neve | Min szélesség | Tipikus eszköz |
|------|--------------|----------------|
| xs | 0px | Mobil (portrait) |
| sm | 600px | Mobil (landscape) / kis tablet |
| md | 960px | Tablet / kis laptop |
| lg | 1280px | Asztali |
| xl | 1920px | Nagy monitor |

**Megjegyzés:** Az alkalmazás desktop-first design; a sidebar (`variant="permanent"`) minden breakpointon látható, ami mobilon nehézkes lehet.

---

## Ikon készlet

**@mui/icons-material** (MUI Icons Material v5.14.0)

Használt ikonok (példák):
- `DashboardIcon` — vezérlőpult
- `StorefrontIcon` — bevásárlóközpontok
- `MapIcon` — térkép
- `AdminPanelSettingsIcon` — admin panel
- `LocalParkingIcon` — parkoló (logo)
- `Brightness4Icon / Brightness7Icon` — téma váltó
- `LanguageIcon` — nyelv váltó
- `LogoutIcon` — kilépés
- `AccountCircleIcon` — felhasználói avatar
- `LocationOnIcon` — helyszín
- `RefreshIcon` — frissítés
- `WarningAmberIcon` — figyelmeztetés

---

## Animációk

- **Framer Motion:** kártya hover-animáció (`scale: 1.02`, `translateY: -4px`), `PageTransition` komponens oldalváltáskor
- **MUI transition:** gomb hover `0.2s ease-in-out`, tárgyak `translateY(-1px)`
- **Leaflet:** térkép zoom/pan natív

---

## Lokalizáció

- **i18next** alapú i18n
- Támogatott nyelvek: **Magyar (HU)** és **Angol (EN)**
- Váltás: AppBar Language menü (minden oldalon)
- Forrás: `src/i18n/config.ts`
