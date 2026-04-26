import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

interface CardGridSkeletonProps {
  count?: number;
  columns?: { xs?: number; sm?: number; md?: number };
}

export default function CardGridSkeleton({
  count = 6,
  columns = { xs: 1, sm: 2, md: 3 },
}: CardGridSkeletonProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${columns.xs ?? 1}, 1fr)`,
          sm: `repeat(${columns.sm ?? 2}, 1fr)`,
          md: `repeat(${columns.md ?? 3}, 1fr)`,
        },
        gap: 3,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <Skeleton variant="rectangular" height={180} animation="wave" />
          <CardContent>
            <Skeleton variant="text" width="80%" height={32} />
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={10} sx={{ borderRadius: 5, mt: 2 }} />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
