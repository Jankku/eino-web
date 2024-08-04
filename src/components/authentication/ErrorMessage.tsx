import { Typography } from '@mui/material';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <Typography
      paragraph
      id="errorText"
      sx={{
        fontWeight: 700,
        color: 'red',
        margin: '0 0 1em 0',
      }}
    >
      {message}
    </Typography>
  );
}
