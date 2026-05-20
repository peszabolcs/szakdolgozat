import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardMedia, Typography, Box, Stack, Button, Skeleton, alpha } from '@mui/material';
import { LocalParking, ArrowOutward } from '@mui/icons-material';
import { ShoppingCenter } from '../types';
import { useTranslation } from 'react-i18next';

interface ShoppingCenterCardProps {
  center: ShoppingCenter;
  onClick?: () => void;
  onReserve?: (center: ShoppingCenter) => void;
}

export const ShoppingCenterCard = ({ center, onClick, onReserve }: ShoppingCenterCardProps) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const availableSpaces = center.capacity - center.occupied;
  const occupancyRate = (center.occupied / center.capacity) * 100;

  const band: 'free' | 'busy' | 'full' =
    occupancyRate >= 85 ? 'full' : occupancyRate >= 60 ? 'busy' : 'free';

  const bandColor = band === 'free' ? '#4d7c0f' : band === 'busy' ? '#b45309' : '#991b1b';
  const bandLabel = band === 'free' ? 'Szabad' : band === 'busy' ? 'Forgalmas' : 'Telt';

  const imageUrl = center.imageUrl
    ?? `https://source.unsplash.com/600x400/?shopping,mall,${encodeURIComponent(center.name)}`;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: '100%' }}
    >
      <Card
        onClick={onClick}
        sx={(theme) => ({
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: onClick ? 'pointer' : 'default',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',
          border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
          borderRadius: 1,
          transition: 'border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease',
          '&:hover': {
            borderColor: alpha(theme.palette.text.primary, 0.28),
            boxShadow: theme.palette.mode === 'dark'
              ? '0 12px 30px -10px rgba(0,0,0,0.5)'
              : '0 12px 30px -10px rgba(15, 27, 23, 0.2)',
          },
        })}
      >
        {/* Image with editorial framing */}
        <Box sx={{ position: 'relative', height: 160, overflow: 'hidden' }}>
          {imageLoading && !imageError && (
            <Skeleton variant="rectangular" width="100%" height={160} animation="wave" />
          )}
          {!imageError ? (
            <CardMedia
              component="img"
              image={imageUrl}
              alt={center.name}
              onError={() => { setImageError(true); setImageLoading(false); }}
              onLoad={() => setImageLoading(false)}
              sx={{
                height: 160,
                objectFit: 'cover',
                display: imageLoading ? 'none' : 'block',
                filter: 'saturate(0.95) contrast(1.02)',
                transition: 'transform 600ms ease',
                '.MuiCard-root:hover &': { transform: 'scale(1.04)' },
              }}
            />
          ) : (
            <Box
              sx={(theme) => ({
                height: 160,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1a2520 0%, #2d4a3e 100%)'
                  : 'linear-gradient(135deg, #2d4a3e 0%, #5b7a6e 100%)',
              })}
            >
              <LocalParking sx={{ fontSize: 64, color: '#F5F1E8', opacity: 0.7 }} />
            </Box>
          )}
          {/* Band indicator chip - top-right */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1,
              py: 0.5,
              backgroundColor: 'rgba(15, 27, 23, 0.78)',
              color: '#F5F1E8',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 999,
              backdropFilter: 'blur(6px)',
            }}
          >
            <Box className="pv-pulse" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: bandColor }} />
            {bandLabel}
          </Box>
        </Box>

        {/* Editorial content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5, pb: onReserve ? 1 : 2.5 }}>
          <Typography
            className="pv-eyebrow"
            sx={{ display: 'block', color: 'text.secondary', mb: 1 }}
          >
            {center.address.split(',')[0]?.replace('Budapest,', '').trim() || 'Budapest'}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 500,
              fontSize: '1.5rem',
              lineHeight: 1.05,
              letterSpacing: '-0.022em',
              color: 'text.primary',
              mb: 1.5,
            }}
          >
            {center.name}
          </Typography>

          {/* Occupancy meter — editorial bar */}
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.75 }}>
              <Typography
                className="pv-eyebrow"
                sx={{ color: 'text.secondary' }}
              >
                Foglaltság
              </Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography
                  className="pv-mono"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {Math.round(occupancyRate)}
                </Typography>
                <Typography
                  className="pv-mono"
                  sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
                >
                  %
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={(theme) => ({
                position: 'relative',
                height: 4,
                width: '100%',
                bgcolor: alpha(theme.palette.text.primary, 0.08),
                overflow: 'hidden',
              })}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${Math.min(100, occupancyRate)}%`,
                  bgcolor: bandColor,
                  transition: 'width 600ms ease',
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography className="pv-mono" sx={{ fontSize: '0.6875rem', color: 'text.secondary', letterSpacing: '0.04em' }}>
                {availableSpaces.toLocaleString('hu-HU')} szabad
              </Typography>
              <Typography className="pv-mono" sx={{ fontSize: '0.6875rem', color: 'text.disabled', letterSpacing: '0.04em' }}>
                / {center.capacity.toLocaleString('hu-HU')}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Reserve button — full-width, editorial */}
        {onReserve && (
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowOutward />}
              disabled={occupancyRate >= 100}
              onClick={(e) => {
                e.stopPropagation();
                onReserve(center);
              }}
              sx={{ justifyContent: 'space-between', py: 1.25 }}
            >
              {t('reservation.cta', 'Foglalás')}
            </Button>
          </Box>
        )}
      </Card>
    </motion.div>
  );
};
