import { Button, DialogActions, DialogContent, Link, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { useExportData } from '../../data/profile/useExportData';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { createJsonBlob, generateExportFileName } from '../../utils/exportUtil';
import PasswordField from '../form/PasswordField';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { parseError, zodFields } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { HTTPError } from 'ky';
import { ProfileExport } from '../../data/profile/profile.types';
import Checkbox from '../form/Checkbox';

const exportFormSchema = z.object({
  password: zodFields.password,
  includeAuditLog: z.boolean(),
});

type ExportForm = z.infer<typeof exportFormSchema>;

type ExportDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function ExportDialog({ visible, closeDialog }: ExportDialogProps) {
  const { showErrorSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: {
      password: '',
      includeAuditLog: false,
    },
    resolver: zodResolver(exportFormSchema),
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

  const onSubmit = (form: ExportForm) => {
    exportData.mutate(form, {
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
            <Typography component="p" sx={{ mb: 1 }}>
              All account data is downloaded as a JSON file. Including audit logs will increase the
              file size significantly.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              Please confirm your password to export your data.
            </Typography>
            {exportData.isSuccess ? (
              <Typography component="p" sx={{ mb: 1 }}>
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
            <Checkbox name="includeAuditLog" label="Include audit logs" />
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
            <Button loading={exportData.isPending} color="primary" type="submit">
              Export
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
