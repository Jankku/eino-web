import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getShareImage, shareProfile } from '../../data/Profile';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { getShareUrl, blobToBase64 } from '../../utils/shareUtil';
import BaseDialog from '../common/BaseDialog';

function ShareDialog({ visible, closeDialog }) {
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const [imageBase64, setImageBase64] = useState();

  const shareProfileQuery = useQuery({
    queryKey: ['shareProfile'],
    queryFn: shareProfile,
    enabled: visible,
    staleTime: 0,
    refetchOnWindowFocus: false,
    onError: (err) => showErrorSnackbar(err.response.data.errors[0].message),
  });

  const shareId = shareProfileQuery?.data;
  const imageQuery = useQuery({
    queryKey: ['shareImage', shareId],
    queryFn: () => getShareImage(shareId),
    enabled: visible && shareId !== undefined,
    staleTime: 0,
    refetchOnWindowFocus: false,
    onSuccess: async (data) => {
      const base64 = await blobToBase64(data);
      return setImageBase64(base64);
    },
    onError: (err) => showErrorSnackbar(err.response.data.errors[0].message),
  });
  const blob = imageQuery?.data;

  const isError = shareProfileQuery.isError || imageQuery.isError;
  const isLoading = shareProfileQuery.isLoading || imageQuery.isLoading;
  const isActionDisabled =
    shareProfileQuery.isFetching ||
    shareProfileQuery.isError ||
    imageQuery.isFetching ||
    imageQuery.isError;

  const onCopyUrl = async () => {
    try {
      const url = getShareUrl(shareId);
      await navigator.clipboard.writeText(url.toString());
      showSuccessSnackbar('Link copied');
    } catch (error) {
      showErrorSnackbar('Failed to copy link');
    }
  };

  const onShare = async () => {
    if (!blob) return showErrorSnackbar('Failed to share image');

    const imageFile = new File([blob], `${shareId}.png`, { type: 'image/png' });
    const shareData = { files: [imageFile] };

    if (!navigator.canShare(shareData)) return showErrorSnackbar('Failed to share image');

    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error.name === 'AbortError') return;
      showErrorSnackbar('Failed to share image');
    }
  };

  return (
    <BaseDialog open={visible} maxWidth={'700'}>
      <DialogTitle>Share profile</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {blob && imageBase64 && <img src={imageBase64} style={{ width: '100%' }} />}
        {isLoading && (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        )}
        {isError && <Typography paragraph>Failed to load image</Typography>}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={() => {
            closeDialog();
            setImageBase64();
          }}
        >
          Cancel
        </Button>
        <Button color="primary" disabled={isActionDisabled} onClick={onCopyUrl}>
          Copy link
        </Button>
        <Button color="primary" disabled={isActionDisabled} onClick={onShare}>
          Share
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}

export default ShareDialog;
