import { Button, DialogActions, DialogContent, DialogTitle, Link, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { useExportData } from '../../data/profile/useExportData';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { createJsonBlob, generateExportFileName } from '../../utils/exportUtil';
import PasswordField from '../form/PasswordField';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { zodFields } from '../../utils/zodUtil';

const passwordFormSchema = z.object({
  password: zodFields.password,
});

function ExportDialog({ visible, closeDialog }) {
  const { showErrorSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(passwordFormSchema),
  });
  const { handleSubmit, setError, reset: resetForm } = formMethods;
  const exportData = useExportData();

  const downloadJsonExport = (data) => {
    try {
      const blob = createJsonBlob(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateExportFileName();
      a.click();
      URL.revokeObjectURL(url);
      resetState();
    } catch (error) {
      console.error(error);
      showErrorSnackbar('Failed to download export file');
    }
  };

  const resetState = () => {
    resetForm();
    exportData.reset();
    closeDialog();
  };

  const onSubmit = ({ password }) => {
    exportData.mutate(password, {
      onSuccess: (data) => {
        downloadJsonExport(data);
      },
      onError: (error) => {
        setError('password', {
          message: error.response.data.errors[0].message,
        });
      },
    });
  };

  return (
    <BaseDialog
      open={visible}
      onClose={() => {
        resetState();
      }}
    >
      <DialogTitle>Export account data</DialogTitle>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography paragraph>
              All account data is downloaded as a JSON file. Please confirm your password to
              continue.
            </Typography>
            {exportData.isSuccess ? (
              <Typography paragraph pb={1}>
                Download didn&apos;t work?{' '}
                <Link
                  download={generateExportFileName()}
                  href={URL.createObjectURL(createJsonBlob(exportData.data))}
                  onClick={() => resetState()}
                >
                  Click here to download
                </Link>
              </Typography>
            ) : null}
            <PasswordField autoFocus name="password" label="Confirm password" />
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              onClick={() => {
                resetState();
              }}
            >
              Cancel
            </Button>
            <LoadingButton loading={exportData.isLoading} color="primary" type="submit">
              Export
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}

export default ExportDialog;
