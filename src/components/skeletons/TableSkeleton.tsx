import { Box, Skeleton, Stack } from '@mui/material';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={24} />
        ))}
      </Stack>
      <Stack spacing={1.5}>
        {Array.from({ length: rows }).map((_, i) => (
          <Stack key={i} direction="row" spacing={2} sx={{ alignItems: 'center', py: 1 }}>
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton
                key={j}
                variant="text"
                width={`${100 / columns}%`}
                height={28}
                animation="wave"
              />
            ))}
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
