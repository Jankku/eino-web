import { Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';

type FooterProps = {
  toggleDrawer: () => void;
};

export default function Footer({ toggleDrawer }: FooterProps) {
  return (
    <Stack
      sx={{
        gap: 2,
      }}
    >
      <Typography
        component="p"
        variant="subtitle2"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Link component={RouterLink} to="/privacy" onClick={() => toggleDrawer()}>
          Privacy
        </Link>
      </Typography>
      <Typography
        component="p"
        variant="subtitle2"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Link href={`https://github.com/Jankku/eino-web/commit/${__COMMIT_HASH__}`}>
          {__COMMIT_HASH__}
        </Link>
      </Typography>
      <Typography
        component="p"
        variant="subtitle2"
        sx={{
          textAlign: 'center',
          marginBottom: '2em',
          color: 'text.secondary',
        }}
      >
        Made by{' '}
        <Link href="https://github.com/Jankku" rel="noreferrer">
          Jankku
        </Link>{' '}
        ✨
      </Typography>
    </Stack>
  );
}
