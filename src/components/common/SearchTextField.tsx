import { TextField, TextFieldProps } from '@mui/material';

type SearchTextFieldProps = {
  params: TextFieldProps;
  label: string;
};

export default function SearchTextField({ params, label }: SearchTextFieldProps) {
  return (
    <TextField
      {...params}
      variant="outlined"
      // @ts-expect-error -- Valid
      sx={(theme) =>
        theme.palette.mode === 'light'
          ? {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: `${theme.palette.primary.contrastText} !important`,
              },
              '& .Mui-focused': {
                color: `${theme.palette.primary.contrastText} !important`,
              },
              '& .MuiInputLabel-root': {
                color: `${theme.palette.primary.contrastText} !important`,
              },
              '& .MuiOutlinedInput-input': {
                color: `${theme.palette.primary.contrastText} !important`,
              },
              '& .MuiSvgIcon-root': {
                color: `${theme.palette.primary.contrastText} !important`,
              },
            }
          : {}
      }
      label={label}
    />
  );
}
