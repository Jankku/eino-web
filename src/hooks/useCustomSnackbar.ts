import { useSnackbar, closeSnackbar } from 'notistack';

export function useCustomSnackbar() {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccessSnackbar = (message: string) =>
    enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: 4000,
      SnackbarProps: {
        onClick: () => closeSnackbar(),
      },
    });

  const showErrorSnackbar = (message: string) =>
    enqueueSnackbar(message, {
      variant: 'error',
      autoHideDuration: 4000,
      SnackbarProps: {
        onClick: () => closeSnackbar(),
      },
    });

  return { showSuccessSnackbar, showErrorSnackbar };
}
