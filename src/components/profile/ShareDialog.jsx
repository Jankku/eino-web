import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { blobToBase64, getShareUrl } from '../../utils/shareUtil';
import BaseDialog from '../common/BaseDialog';
import { useShareprofile } from '../../data/profile/useShareProfile';
import { useShareImage } from '../../data/profile/useShareImage';
import { useState } from 'react';

function ShareDialog({ visible, closeDialog }) {
  const [base64, setBase64] = useState();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const shareProfileQuery = useShareprofile(visible);
  const shareId = shareProfileQuery?.data;
  const shareImage = useShareImage(visible, shareId, async (data) => {
    const imageBase64 = await blobToBase64(data);
    setBase64(imageBase64);
  });
  const blob = shareImage?.data;

  const isError = shareProfileQuery.isError || shareImage.isError;
  const isLoading = shareProfileQuery.isLoading || shareImage.isLoading;
  const isActionDisabled = isError || isLoading;

  const onCopyUrl = async () => {
    try {
      const url = getShareUrl(shareId);
      await navigator.clipboard.writeText(url);
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

  const onClose = () => {
    closeDialog();
    setBase64();
    shareProfileQuery.remove();
  };

  return (
    <BaseDialog open={visible} maxWidth={'700'} onClose={onClose}>
      <DialogTitle>Share profile</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {isLoading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : null}
        {base64 ? <img src={base64} style={{ width: '100%' }} /> : null}
        {isError ? <Typography paragraph>Failed to load image</Typography> : null}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
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
