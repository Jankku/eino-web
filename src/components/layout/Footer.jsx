import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <Typography
        paragraph
        variant="subtitle2"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Link component={RouterLink} to="/privacy">
          Privacy
        </Link>
      </Typography>

      <Typography
        paragraph
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
        paragraph
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
    </>
  );
}
