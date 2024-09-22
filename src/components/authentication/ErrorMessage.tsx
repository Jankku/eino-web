import { Typography } from '@mui/material';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <Typography
      component="p"
      id="errorText"
      sx={{
        fontWeight: 700,
        color: 'red',
      }}
    >
      {message}
    </Typography>
  );
}
