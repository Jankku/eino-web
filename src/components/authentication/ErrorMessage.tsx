import { useId } from 'react';
import { Typography } from '@mui/material';

type ErrorMessageProps = {
  message: string;
  id?: string;
};

export default function ErrorMessage({ message, id }: ErrorMessageProps) {
  const generatedId = useId();

  return (
    <Typography
      component="p"
      id={id ?? generatedId}
      role="alert"
      aria-atomic="true"
      sx={{ fontWeight: 700, color: 'error.main', pb: 2 }}
    >
      {message}
    </Typography>
  );
}
