import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

type SettingsCardProps = {
  actionsAsRow?: boolean;
  title: string;
  message: string;
  actions: React.ReactNode;
};

export default function SettingsCard({ actionsAsRow, title, message, actions }: SettingsCardProps) {
  return (
    <Card component="section">
      <CardContent>
        <Box
          component="h2"
          sx={(theme) => ({
            fontSize: theme.typography.htmlFontSize * 1.25,
            marginTop: 0,
            marginBottom: 1,
          })}
        >
          {title}
        </Box>
        <Stack
          direction={actionsAsRow ? 'column' : 'row'}
          spacing={3}
          alignItems={actionsAsRow ? 'flex-start' : 'center'}
        >
          <Typography variant="body1" sx={{ textWrap: 'balance' }}>
            {message}
          </Typography>
          {actions ? (
            <Stack direction="row" gap={1}>
              {actions}
            </Stack>
          ) : undefined}
        </Stack>
      </CardContent>
    </Card>
  );
}
