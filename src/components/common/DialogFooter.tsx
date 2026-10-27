import { Button, ButtonProps, DialogActions, DialogActionsProps } from '@mui/material';

export default function DialogFooter({ children, sx = [], ...props }: DialogActionsProps) {
  return (
    <DialogActions
      disableSpacing
      {...props}
      sx={[
        {
          px: 3,
          py: 2,
          gap: 1,
          borderTop: 1,
          borderColor: 'divider',
          flexWrap: 'wrap',
          '& .MuiButton-contained': { px: 3 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </DialogActions>
  );
}

export function DialogPrimaryButton(props: ButtonProps) {
  return <Button variant="contained" disableElevation {...props} />;
}
