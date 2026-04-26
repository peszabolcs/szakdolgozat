import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

export default function DashboardSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width={240} height={48} sx={{ mb: 1 }} />
      <Skeleton variant="text" width={360} height={24} sx={{ mb: 4 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width="70%" height={56} sx={{ my: 1 }} />
              <Skeleton variant="text" width={140} height={18} />
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card>
        <CardContent>
          <Skeleton variant="text" width={220} height={32} sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="text" width={120} />
                <Skeleton variant="rectangular" height={10} sx={{ flex: 1, borderRadius: 5 }} />
                <Skeleton variant="text" width={48} />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
