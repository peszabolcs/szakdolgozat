import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon && (
            <Box sx={{ mr: 1, color: color || 'primary.main' }}>{icon}</Box>
          )}
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
