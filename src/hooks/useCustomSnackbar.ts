import { useSnackbar, closeSnackbar } from 'notistack';
import { useCallback } from 'react';

export function useCustomSnackbar() {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccessSnackbar = useCallback(
    (message: string) =>
      enqueueSnackbar(message, {
        variant: 'success',
        autoHideDuration: 4000,
        SnackbarProps: {
          onClick: () => closeSnackbar(),
        },
      }),
    [enqueueSnackbar],
  );

  const showErrorSnackbar = useCallback(
    (message: string) =>
      enqueueSnackbar(message, {
        variant: 'error',
        autoHideDuration: 4000,
        SnackbarProps: {
          onClick: () => closeSnackbar(),
        },
      }),
    [enqueueSnackbar],
  );

  return { showSuccessSnackbar, showErrorSnackbar };
}
