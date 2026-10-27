import DialogFooter, { DialogPrimaryButton } from '../common/DialogFooter';
import { Box, Button, CircularProgress, DialogContent, Typography } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import BaseDialog from '../common/BaseDialog';
import { FormProvider, useForm } from 'react-hook-form';
import { parseError } from '../../utils/zodUtil';
import { useImportData } from '../../data/profile/useImportData';
import ErrorMessage from '../authentication/ErrorMessage';
import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import {
  byteFormatter,
  FileValidationError,
  ImportPreview,
  readEinoImportFile,
} from '../../utils/importUtil';
import { HTTPError } from 'ky';
import Dropzone from './Dropzone';

type ImportDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function ImportDialog({ visible, closeDialog }: ImportDialogProps) {
  const [selection, setSelection] = useState<{ file: File; preview: ImportPreview } | null>(null);
  const [isReading, setIsReading] = useState(false);
  const readRequestRef = useRef(0);
  const [fileErrors, setFileErrors] = useState<FileValidationError[]>([]);
  const formMethods = useForm();
  const {
    handleSubmit,
    setError,
    clearErrors,
    reset: resetForm,
    formState: { errors },
  } = formMethods;
  const queryClient = useQueryClient();
  const importData = useImportData();
  const { showSuccessSnackbar } = useCustomSnackbar();

  const onDrop = async (acceptedFiles: File[]) => {
    const request = ++readRequestRef.current;
    setSelection(null);
    setFileErrors([]);
    clearErrors();

    const file = acceptedFiles[0];
    if (!file) {
      setIsReading(false);
      setFileErrors([{ code: 'invalid_selection', message: 'Please select one Eino JSON file.' }]);
      return;
    }

    setIsReading(true);
    const { preview, errors } = await readEinoImportFile(file);
    if (request !== readRequestRef.current) return;

    setIsReading(false);
    setFileErrors(errors);
    if (preview) setSelection({ file, preview });
  };

  const onSubmit = async () => {
    if (!selection || isReading || importData.isPending) return;

    clearErrors();
    const fileBlob = new Blob([selection.file], { type: 'application/json' });

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
    readRequestRef.current += 1;
    setSelection(null);
    setIsReading(false);
    setFileErrors([]);
    resetForm();
    closeDialog();
  };

  const importButtonDisabled = !selection || isReading || importData.isPending;

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
        <form
          onSubmit={(event) => {
            handleSubmit(onSubmit)(event);
          }}
        >
          <DialogContent sx={{ pt: 0 }}>
            <Typography color="text.secondary" sx={{ mb: 2.5 }}>
              Choose an Eino JSON export to import into your account. Your existing data will be
              kept.
            </Typography>
            <section>
              <Dropzone
                options={{
                  maxFiles: 1,
                  multiple: false,
                  onDrop,
                  disabled: importData.isPending,
                }}
                sx={{
                  p: selection ? 2 : 3,
                  border: '1px dashed',
                  borderColor: selection ? 'divider' : 'primary.main',
                  borderRadius: 2,
                  backgroundColor: 'action.hover',
                  boxShadow: 'none',
                  textAlign: selection ? 'left' : 'center',
                  transition: 'border-color 150ms, background-color 150ms',
                  '&:hover, &:focus-visible': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.selected',
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 3,
                  },
                  '&[aria-disabled="true"]': { opacity: 0.6, cursor: 'default' },
                }}
              >
                {isReading ? (
                  <Box
                    role="status"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress size={20} />
                    <Typography variant="body2">Reading file…</Typography>
                  </Box>
                ) : selection ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <DescriptionOutlinedIcon color="primary" sx={{ fontSize: 28, flexShrink: 0 }} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}
                      >
                        {selection.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {byteFormatter.format(selection.file.size)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ flexShrink: 0, fontWeight: 500 }}
                    >
                      Change file
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <UploadFileOutlinedIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Choose a JSON file
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      or drag and drop it here · Max 10 MB
                    </Typography>
                  </>
                )}
              </Dropzone>
              {selection ? (
                <Box role="status" aria-label="Import preview" sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    Import preview
                  </Typography>
                  <Box
                    component="dl"
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: 1.5,
                      m: 0,
                    }}
                  >
                    {[
                      {
                        label: 'Books',
                        count: selection.preview.bookCount,
                        Icon: MenuBookOutlinedIcon,
                      },
                      {
                        label: 'Movies',
                        count: selection.preview.movieCount,
                        Icon: MovieOutlinedIcon,
                      },
                    ].map(({ label, count, Icon }) => (
                      <Box key={label} sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                        <Box
                          component="dt"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: 'text.secondary',
                          }}
                        >
                          <Icon sx={{ fontSize: 18 }} />
                          <Typography component="span" variant="body2">
                            {label}
                          </Typography>
                        </Box>
                        <Typography
                          component="dd"
                          sx={{
                            m: 0,
                            mt: 0.5,
                            fontSize: '2rem',
                            fontWeight: 600,
                            lineHeight: 1.3,
                            fontVariantNumeric: 'tabular-nums',
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {count.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5, overflowWrap: 'anywhere' }}
                  >
                    Exported by{' '}
                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
                      {selection.preview.username}
                    </Box>
                  </Typography>
                  {selection.preview.bookCount === 0 && selection.preview.movieCount === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                      This file contains no books or movies.
                    </Typography>
                  ) : null}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    Counts reflect the items in this file.
                  </Typography>
                </Box>
              ) : null}
              <Box
                sx={{
                  pt: 1,
                }}
              >
                {fileErrors.length > 0 ? (
                  <ErrorMessage message={fileErrors.map((error) => error.message).join(' ')} />
                ) : null}
              </Box>
              {errors.root?.serverError?.message ? (
                <ErrorMessage message={errors.root.serverError.message} />
              ) : null}
            </section>
          </DialogContent>
          <DialogFooter>
            <Button
              color="inherit"
              onClick={() => {
                resetState();
              }}
            >
              Cancel
            </Button>
            <DialogPrimaryButton
              loading={importData.isPending}
              disabled={importButtonDisabled}
              type="submit"
            >
              Import
            </DialogPrimaryButton>
          </DialogFooter>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
