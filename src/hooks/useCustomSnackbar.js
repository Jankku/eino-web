import { useSnackbar } from 'notistack';

function useCustomSnackbar() {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccessSnackbar = (message) =>
    enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: 2000,
    });

  const showErrorSnackbar = (message) =>
    enqueueSnackbar(message, {
      variant: 'error',
      autoHideDuration: 2000,
    });

  return { showSuccessSnackbar, showErrorSnackbar };
}

export default useCustomSnackbar;
