import { TextField } from '@mui/material';

function SearchTextField({ params, label }) {
  return (
    <TextField
      {...params}
      variant="outlined"
      sx={(theme) =>
        theme.palette.mode === 'light' && {
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
      }
      label={label}
    />
  );
}

export default SearchTextField;
