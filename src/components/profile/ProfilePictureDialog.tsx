import DialogFooter, { DialogPrimaryButton } from '../common/DialogFooter';
import { Avatar, Box, Button, DialogContent, Stack, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { FormProvider, useForm } from 'react-hook-form';
import { parseError } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { useEffect, useRef, useState } from 'react';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { byteFormatter, FileValidationError, imageValidator } from '../../utils/importUtil';
import { HTTPError } from 'ky';
import { useUploadProfilePicture } from '../../data/profile/useUploadProfilePicture';
import { useDeleteProfilePicture } from '../../data/profile/useDeleteProfilePicture';
import Dropzone from './Dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
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
    clearErrors,
    formState: { errors, isSubmitting },
  } = formMethods;
  const uploadProfilePicture = useUploadProfilePicture();
  const deleteProfilePicture = useDeleteProfilePicture();
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
    const file = acceptedFiles[0];
    if (!file) {
      setFileErrors([{ code: 'invalid_selection', message: 'Please select one image file.' }]);
      return;
    }
    const errors = await imageValidator(file);
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

  const getCanvasBlob = async (): Promise<Blob> => {
    const file = files[0];
    const canvas = await cropperRef.current?.$toCanvas();
    if (!file || !canvas) {
      throw new Error('The picture preview is not ready. Please select the picture again.');
    }
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size === 0) {
            reject(new Error('Could not encode the picture. Please select the picture again.'));
            return;
          }
          resolve(blob);
        },
        file.type,
        0.95,
      );
    });
  };

  const showPictureError = async (error: unknown) => {
    let message = 'Could not update the profile picture. Please try again.';
    if (error instanceof HTTPError) {
      const errors = await parseError(error).catch(() => []);
      message = errors[0]?.message || message;
    } else if (error instanceof Error) {
      message = error.message || message;
    }
    setError('root.serverError', { message });
  };

  const onSubmit = async () => {
    if (files.length === 0 || fileErrors.length > 0) return;
    clearErrors('root.serverError');

    try {
      const blob = await getCanvasBlob();
      const result = await uploadProfilePicture.mutateAsync(blob);
      showSuccessSnackbar(result.message);
      resetState();
    } catch (error) {
      await showPictureError(error);
    }
  };

  const deleteCurrentProfilePicture = () => {
    clearErrors('root.serverError');
    deleteProfilePicture.mutate(undefined, {
      onSuccess: (result) => {
        showSuccessSnackbar(result.message);
      },
      onError: showPictureError,
    });
  };

  const resetState = () => {
    setFiles([]);
    setFileErrors([]);
    onClose();
  };

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    // eslint-disable-next-line @eslint-react/exhaustive-deps, react-hooks/exhaustive-deps
  }, []);

  const saveButtonDisabled =
    isSubmitting ||
    uploadProfilePicture.isPending ||
    deleteProfilePicture.isPending ||
    files.length === 0 ||
    fileErrors.length > 0;

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
        <form
          onSubmit={(event) => {
            handleSubmit(onSubmit)(event);
          }}
        >
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
            <Dropzone
              label={files.length > 0 ? 'Change profile picture' : 'Choose profile picture'}
              options={{
                maxFiles: 1,
                multiple: false,
                accept: {
                  'image/*': [],
                },
                onDrop,
                disabled:
                  isSubmitting || uploadProfilePicture.isPending || deleteProfilePicture.isPending,
              }}
              compact={files.length > 0}
            >
              {files.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ImageOutlinedIcon color="primary" sx={{ fontSize: 28, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                      {files[0].name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {byteFormatter.format(files[0].size)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="primary"
                    sx={{ flexShrink: 0, fontWeight: 500 }}
                  >
                    Change picture
                  </Typography>
                </Box>
              ) : (
                <>
                  <AddPhotoAlternateOutlinedIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Choose a picture
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    or drag and drop it here · Images only · Max 10 MB
                  </Typography>
                </>
              )}
            </Dropzone>
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
              loading={isSubmitting || uploadProfilePicture.isPending}
              disabled={saveButtonDisabled}
              type="submit"
            >
              Save
            </DialogPrimaryButton>
          </DialogFooter>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
