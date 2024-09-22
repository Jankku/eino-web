import { Box, Button, DialogActions, DialogContent, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { parseError } from '../../utils/zodUtil';
import { useImportData } from '../../data/profile/useImportData';
import ErrorMessage from '../authentication/ErrorMessage';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { byteFormatter, FileValidationError, einoJsonValidator } from '../../utils/importUtil';
import { HTTPError } from 'ky';
import Dropzone from './Dropzone';

type ImportDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function ImportDialog({ visible, closeDialog }: ImportDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<FileValidationError[]>([]);
  const formMethods = useForm();
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;
  const queryClient = useQueryClient();
  const importData = useImportData();
  const { showSuccessSnackbar } = useCustomSnackbar();

  const onDrop = async (acceptedFiles: File[]) => {
    const errors = await einoJsonValidator(acceptedFiles[0]);
    setFileErrors(errors);
    if (errors.length === 0) setFiles(acceptedFiles);
  };

  const onSubmit = async () => {
    if (files.length === 0) return;

    const fileBlob = new Blob([files[0]], { type: 'application/json' });

    importData.mutate(fileBlob, {
      onSuccess: (result) => {
        showSuccessSnackbar(result.message);
        queryClient.refetchQueries();
        resetState();
      },
      onError: async (error) => {
        const errors = await parseError(error as HTTPError);
        setError('root.serverError', {
          message: errors[0].message,
        });
      },
    });
  };

  const resetState = () => {
    setFiles([]);
    setFileErrors([]);
    closeDialog();
  };

  const importButtonDisabled = files.length === 0 || fileErrors.length > 0 || importData.isPending;

  return (
    <BaseDialog
      title="Import account data"
      maxWidth="xs"
      open={visible}
      onClose={() => {
        resetState();
      }}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography
              component="p"
              sx={{
                mb: 2,
              }}
            >
              Import your Eino account data from a JSON file. This action will not remove any
              existing data.
            </Typography>
            <section>
              <Dropzone
                options={{
                  maxFiles: 1,
                  multiple: false,
                  onDrop,
                }}
              >
                {files.length > 0 ? (
                  files.map((file) => (
                    <Typography key={file.name}>
                      {file.name} ({byteFormatter.format(file.size)})
                    </Typography>
                  ))
                ) : (
                  <Typography>Drag and drop or click to select Eino JSON file</Typography>
                )}
              </Dropzone>
              <Box
                sx={{
                  pt: 1,
                }}
              >
                {fileErrors.map((e, index) => (
                  <ErrorMessage key={index} message={e.message} />
                ))}
              </Box>
              {errors.root?.serverError?.message ? (
                <ErrorMessage message={errors.root.serverError.message} />
              ) : null}
            </section>
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
            <LoadingButton
              loading={importData.isPending}
              disabled={importButtonDisabled}
              color="primary"
              type="submit"
            >
              Import
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
