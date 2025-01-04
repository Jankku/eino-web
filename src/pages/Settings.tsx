import { Button, Container, Stack } from '@mui/material';
import Head from '../components/common/Head';
import SettingsCard from '../components/settings/SettingsCard';
import { useCustomSnackbar } from '../hooks/useCustomSnackbar';

export default function Settings() {
  const { showSuccessSnackbar } = useCustomSnackbar();

  const clearClosedBulletins = () => {
    localStorage.removeItem('closedBulletins');
    window.dispatchEvent(new Event('storage'));
    showSuccessSnackbar('Closed bulletins cleared');
  };

  return (
    <Container maxWidth="sm">
      <Head pageTitle="Settings" />
      <h1>Settings</h1>
      <Stack spacing={3}>
        <SettingsCard
          title="Clear closed bulletins"
          message="If you accidentally closed a bulletin, you can make it visible again."
          actions={
            <Button color="secondary" variant="contained" onClick={clearClosedBulletins}>
              Clear
            </Button>
          }
        />
      </Stack>
    </Container>
  );
}
