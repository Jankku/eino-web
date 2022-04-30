import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <Typography
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
        }}
        variant="subtitle2"
        paragraph
      >
        <Link component={RouterLink} to="/privacy">
          Privacy
        </Link>
      </Typography>

      <Typography
        sx={{
          textAlign: 'center',
          margin: '2em 0em',
          color: 'text.secondary',
        }}
        variant="subtitle2"
        paragraph
      >
        Made by{' '}
        <Link href="https://github.com/Jankku" target="_blank">
          Jankku
        </Link>{' '}
        ✨
      </Typography>
    </>
  );
}
