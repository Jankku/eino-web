import { Box } from '@mui/system';
import { Card, CardContent, Stack, Typography } from '@mui/material';

type InfoCardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export default function InfoCard({ title, icon, children }: InfoCardProps) {
  return (
    <Card
      component="li"
      sx={{
        padding: '0.2em',
        border: 1,
        borderColor: 'primary.main',
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack direction="row" mb="0.3em" alignItems="center">
          <Box sx={{ marginRight: '0.5em', height: '24px' }}>{icon}</Box>
          <Typography component="h3" variant="h6">
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}
