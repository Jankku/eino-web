import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

type SettingsCardProps = {
  title: string;
  message: string;
  actions: React.ReactNode;
};

export default function SettingsCard({ title, message, actions }: SettingsCardProps) {
  return (
    <Card component="section">
      <CardContent>
        <Box
          component="h2"
          sx={(theme) => ({
            fontSize: theme.typography.fontSize * 1.5,
            marginTop: 0,
            marginBottom: 1,
          })}
        >
          {title}
        </Box>
        <Stack
          direction="row"
          spacing={{ xs: 4 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="body1" sx={{ maxWidth: '22em' }}>
              {message}
            </Typography>
          </Box>
          {actions ? <>{actions}</> : undefined}
        </Stack>
      </CardContent>
    </Card>
  );
}
