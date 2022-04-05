import { Link, Typography } from '@mui/material';

export default function Footer() {
  return (
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
  );
}
