import { Button, DialogActions, DialogContent, Link, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { useExportData } from '../../data/profile/useExportData';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { createJsonBlob, generateExportFileName } from '../../utils/exportUtil';
import PasswordField from '../form/PasswordField';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { parseError, zodFields } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { HTTPError } from 'ky';
import { ProfileExport } from '../../data/profile/profile.types';

const passwordFormSchema = z.object({
  password: zodFields.password,
});

type ExportDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function ExportDialog({ visible, closeDialog }: ExportDialogProps) {
  const { showErrorSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(passwordFormSchema),
  });
  const {
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = formMethods;
  const exportData = useExportData();

  const downloadJsonExport = (data: ProfileExport) => {
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

  const onSubmit = ({ password }: { password: string }) => {
    exportData.mutate(password, {
      onSuccess: (data) => {
        downloadJsonExport(data);
      },
      onError: async (error) => {
        const errors = await parseError(error as HTTPError);
        setError('root.serverError', {
          message: errors[0].message,
        });
      },
    });
  };

  return (
    <BaseDialog
      title="Export account data"
      maxWidth="xs"
      open={visible}
      onClose={() => {
        resetState();
      }}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography component="p">
              All account data is downloaded as a JSON file. Please confirm your password to
              continue.
            </Typography>
            {exportData.isSuccess ? (
              <Typography component="p" pb={1}>
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
            {errors.root?.serverError?.message ? (
              <ErrorMessage message={errors.root.serverError.message} />
            ) : null}
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
            <LoadingButton loading={exportData.isPending} color="primary" type="submit">
              Export
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
