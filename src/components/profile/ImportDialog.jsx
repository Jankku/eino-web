import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { parseError } from '../../utils/zodUtil';
import { useImportData } from '../../data/profile/useImportData';
import { useDropzone } from 'react-dropzone';
import ErrorMessage from '../authentication/ErrorMessage';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useThemeContext } from '../../providers/ThemeProvider';
import { byteFormatter, fileValidator } from '../../utils/importUtil';

function ImportDialog({ visible, closeDialog }) {
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const errors = await fileValidator(acceptedFiles[0]);
      setFileErrors(errors);
      if (errors.length === 0) setFiles(acceptedFiles);
    },
  });
  const formMethods = useForm();
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;
  const { isDark } = useThemeContext();
  const queryClient = useQueryClient();
  const importData = useImportData();
  const { showSuccessSnackbar } = useCustomSnackbar();

  const onSubmit = async () => {
    if (files.length === 0) return;

    const fileBlob = new Blob([files[0]], { type: 'application/json' });

    importData.mutate(fileBlob, {
      onSuccess: (result) => {
        showSuccessSnackbar(result.results[0].message);
        queryClient.refetchQueries();
        resetState();
      },
      onError: async (error) => {
        const errors = await parseError(error);
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
      open={visible}
      onClose={() => {
        resetState();
      }}
    >
      <DialogTitle>Import account data</DialogTitle>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography paragraph>
              Import your Eino account data from a JSON file. This action will not remove any
              existing data.
            </Typography>
            <section>
              <Paper
                {...getRootProps()}
                elevation={2}
                sx={{
                  backgroundColor: isDark ? '#25272c' : 'grey.200',
                  px: 1,
                  py: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <input {...getInputProps()} />
                {files.length > 0 ? (
                  files.map((file) => (
                    <Typography key={file.name}>
                      {file.name} ({byteFormatter.format(file.size)})
                    </Typography>
                  ))
                ) : (
                  <Typography>
                    Drag and drop Eino JSON file here, or click to select a file
                  </Typography>
                )}
              </Paper>
              <Box pt={1}>
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

export default ImportDialog;
