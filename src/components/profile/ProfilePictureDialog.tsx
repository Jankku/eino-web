import {
  Avatar,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { FormProvider, useForm } from 'react-hook-form';
import { parseError } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { useEffect, useRef, useState } from 'react';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { FileValidationError, imageValidator } from '../../utils/importUtil';
import { HTTPError } from 'ky';
import { useUploadProfilePicture } from '../../data/profile/useUploadProfilePicture';
import Dropzone from './Dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import Cropper from '../common/Cropper';
import { CropperCanvas } from 'cropperjs';

type ProfilePictureDialogProps = {
  visible: boolean;
  profilePictureUrl: string | undefined;
  onClose: () => void;
};

type FileWithPreview = File & { preview: string };

export default function ProfilePictureDialog({
  visible,
  profilePictureUrl,
  onClose,
}: ProfilePictureDialogProps) {
  const cropperRef = useRef<CropperCanvas>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [fileErrors, setFileErrors] = useState<FileValidationError[]>([]);
  const formMethods = useForm();
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;
  const uploadProfilePicture = useUploadProfilePicture();
  const deleteProfilePicture = useUploadProfilePicture();
  const { showSuccessSnackbar } = useCustomSnackbar();

  const thumbnails = files.map((file) => (
    <Cropper
      key={file.name}
      src={file.preview}
      alt="Profile picture preview"
      ref={cropperRef}
      onLoad={() => {
        URL.revokeObjectURL(file.preview);
      }}
    />
  ));

  const onDrop = async (acceptedFiles: File[]) => {
    const errors = await imageValidator(acceptedFiles[0]);
    setFileErrors(errors);
    if (errors.length === 0) {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    }
  };

  const getCanvasBlob = async () => {
    const canvas = await cropperRef.current?.$toCanvas();
    return new Promise<Blob | null>((resolve) =>
      canvas?.toBlob(resolve, files[0].type, 0.9),
    ) as Promise<Blob>;
  };

  const onSubmit = async () => {
    if (files.length === 0) return;

    const blob = await getCanvasBlob();

    uploadProfilePicture.mutate(blob, {
      onSuccess: (result) => {
        showSuccessSnackbar(result.message);
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

  const deleteCurrentProfilePicture = () => {
    deleteProfilePicture.mutate(undefined, {
      onSuccess: (result) => {
        showSuccessSnackbar(result.message);
      },
    });
  };

  const resetState = () => {
    setFiles([]);
    setFileErrors([]);
    onClose();
  };

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveButtonDisabled = uploadProfilePicture.isPending || files.length === 0;

  return (
    <BaseDialog
      title="Edit profile picture"
      maxWidth="xs"
      open={visible}
      onClose={() => {
        resetState();
      }}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                pb: 2,
              }}
            >
              {files.length === 0 && profilePictureUrl ? (
                <Stack
                  sx={{
                    gap: 1,
                  }}
                >
                  <Avatar
                    src={profilePictureUrl}
                    alt="Profile picture"
                    sx={{ width: 128, height: 128, alignSelf: 'center' }}
                  ></Avatar>
                  <Button
                    loading={deleteProfilePicture.isPending}
                    color="secondary"
                    size="small"
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    onClick={deleteCurrentProfilePicture}
                  >
                    Delete picture
                  </Button>
                </Stack>
              ) : undefined}
              {thumbnails}
            </Box>
            <Typography
              component="p"
              sx={{
                mb: 2,
              }}
            >
              Only image files are allowed and the file size must be less than 10MB.
            </Typography>
            <Dropzone
              options={{
                maxFiles: 1,
                multiple: false,
                accept: {
                  'image/*': [],
                },
                onDrop,
              }}
            >
              <Typography>Drag and drop or click to select a new picture</Typography>
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
            <Button
              loading={uploadProfilePicture.isPending}
              disabled={saveButtonDisabled}
              color="primary"
              type="submit"
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
