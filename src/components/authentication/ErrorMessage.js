import { Typography } from '@mui/material';

export default function ErrorMessage({ message }) {
  return (
    <Typography
      paragraph
      name="errorText"
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
