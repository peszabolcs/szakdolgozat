import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Chip,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  LocalParking,
} from '@mui/icons-material';
import { ShoppingCenter } from '../types';
import { useTranslation } from 'react-i18next';

interface ShoppingCenterCardProps {
  center: ShoppingCenter;
  onClick?: () => void;
}

export const ShoppingCenterCard = ({ center, onClick }: ShoppingCenterCardProps) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const availableSpaces = center.capacity - center.occupied;
  const occupancyRate = (center.occupied / center.capacity) * 100;

  const getOccupancyColor = () => {
    if (occupancyRate >= 90) return 'error';
    if (occupancyRate >= 70) return 'warning';
    return 'success';
  };

  // Generate Unsplash placeholder URL with shopping mall theme
  const getImageUrl = () => {
    if (imageError) return null;
    if (center.imageUrl) return center.imageUrl;
    // Use Unsplash placeholder with shopping mall theme and center name as seed
    return `https://source.unsplash.com/400x300/?shopping,mall,${encodeURIComponent(center.name)}`;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, y: -4 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'box-shadow 0.2s',
          '&:hover': onClick
            ? {
                boxShadow: 8,
              }
            : {},
        }}
        onClick={onClick}
      >
      <Box sx={{ position: 'relative', height: 180 }}>
        {imageLoading && !imageError && (
          <Skeleton variant="rectangular" width="100%" height={180} animation="wave" />
        )}
        {(() => {
          const imageUrl = getImageUrl();
          return !imageError && imageUrl ? (
            <CardMedia
              component="img"
              image={imageUrl}
              alt={center.name}
              onError={handleImageError}
              onLoad={handleImageLoad}
              sx={{
                height: 180,
                objectFit: 'cover',
                display: imageLoading ? 'none' : 'block',
              }}
            />
          ) : null;
        })()}
        {imageError && (
          <Box
            sx={{
              height: 180,
              bgcolor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #3d8492 0%, #33a498 100%)'
                  : 'linear-gradient(135deg, #26636f 0%, #00897b 100%)',
            }}
          >
            <LocalParking sx={{ fontSize: 64, color: 'white', opacity: 0.8 }} />
          </Box>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {center.name}
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <LocationOn sx={{ fontSize: 20, color: 'text.secondary', mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {center.address}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Schedule sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {center.openingHours}
            </Typography>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {t('public.availableSpaces', 'Available Spaces')}
              </Typography>
              <Chip
                label={`${availableSpaces} / ${center.capacity}`}
                color={getOccupancyColor()}
                size="small"
              />
            </Stack>
            <LinearProgress
              variant="determinate"
              value={occupancyRate}
              color={getOccupancyColor()}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {occupancyRate.toFixed(0)}% {t('public.occupied', 'occupied')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
    </motion.div>
  );
};
