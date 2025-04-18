import { Box, TextField, TextFieldProps, Typography } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';

type SearchTextFieldProps = {
  params: TextFieldProps;
  label: string;
  showShortcut?: boolean;
};

export default function SearchTextField({
  params,
  label,
  showShortcut = false,
}: SearchTextFieldProps) {
  const isMobile = useIsMobile();

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        {...params}
        label={label}
        sx={(theme) => ({
          ...theme.applyStyles('light', {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: `${theme.vars.palette.primary.contrastText} !important`,
            },
            '& .Mui-focused': {
              color: `${theme.vars.palette.primary.contrastText} !important`,
            },
            '& .MuiInputLabel-root': {
              color: `${theme.vars.palette.primary.contrastText} !important`,
            },
            '& .MuiOutlinedInput-input': {
              color: `${theme.vars.palette.primary.contrastText} !important`,
            },
            '& .MuiSvgIcon-root': {
              color: `${theme.vars.palette.primary.contrastText} !important`,
            },
          }),
        })}
      />
      {!isMobile && showShortcut ? (
        <Typography
          aria-hidden="true"
          component="span"
          variant="body2"
          sx={(theme) => ({
            position: 'absolute',
            top: 10,
            right: 12,
            padding: '0 4px',
            fontWeight: 'bold',
            borderRadius: 1,
            backgroundColor: theme.vars.palette.primary.dark,
            color: theme.vars.palette.common.white,
            outline: `1px solid ${theme.vars.palette.primary.light}`,
            ...theme.applyStyles('dark', {
              backgroundColor: theme.vars.palette.background.paper,
              color: theme.vars.palette.text.secondary,
              outline: `1px solid ${theme.vars.palette.grey[800]}`,
            }),
          })}
        >
          <kbd>Ctrl</kbd>+<kbd>K</kbd>
        </Typography>
      ) : undefined}
    </Box>
  );
}
