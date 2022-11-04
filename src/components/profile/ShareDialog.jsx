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
import { useQuery } from 'react-query';
import { getShareImage, shareProfile } from '../../data/Profile';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import BaseDialog from '../common/BaseDialog';

function ShareDialog({ visible, closeDialog }) {
  const [image, setImage] = useState();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const shareProfileQuery = useQuery(['shareProfile'], shareProfile, {
    enabled: visible,
    staleTime: 1000 * 10,
    refetchOnWindowFocus: false,
    onError: (err) => showErrorSnackbar(err.response.data.errors[0].message),
  });
  const shareId = shareProfileQuery?.data;

  const imageQuery = useQuery(['shareImage', shareId], () => getShareImage(shareId), {
    enabled: visible && shareId !== undefined,
    staleTime: 0,
    refetchOnWindowFocus: false,
    onSuccess: async (data) => {
      const base64 = await imgToBase64(data);
      setImage(base64);
    },
    onError: (err) => showErrorSnackbar(err.response.data.errors[0].message),
  });

  const isLoading = shareProfileQuery.isFetching || imageQuery.isFetching;
  const isCopyButtonDisabled =
    shareProfileQuery.isFetching ||
    shareProfileQuery.isError ||
    imageQuery.isFetching ||
    imageQuery.isError;

  const copyUrlToClipboard = async () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const url = new URL(`/api/share/${shareId}`, baseUrl);
    try {
      await navigator.clipboard.writeText(url.toString());
      showSuccessSnackbar('Link copied');
    } catch (error) {
      showErrorSnackbar('Failed to copy link');
    }
  };

  return (
    <BaseDialog open={visible} maxWidth={'700'}>
      <DialogTitle>Share profile</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {isLoading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : image ? (
          <img src={image} />
        ) : (
          <Typography paragraph>Failed to load image</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={() => {
            closeDialog();
            setImage();
          }}
        >
          Cancel
        </Button>
        <Button color="primary" disabled={isCopyButtonDisabled} onClick={copyUrlToClipboard}>
          Copy link
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}

const imgToBase64 = async (image) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = (r) => resolve(r.target.result);
  });
};

export default ShareDialog;
