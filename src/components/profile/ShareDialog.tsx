import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  GridLegacy,
  Typography,
} from '@mui/material';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { getShareUrl } from '../../utils/shareUtil';
import BaseDialog from '../common/BaseDialog';
import { useShareprofile } from '../../data/profile/useShareProfile';
import ky from 'ky';
import { useQueryClient } from '@tanstack/react-query';

type ShareDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function ShareDialog({ visible, closeDialog }: ShareDialogProps) {
  const queryClient = useQueryClient();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const shareProfileQuery = useShareprofile(visible);
  const shareId = shareProfileQuery?.data;
  const shareUrl = getShareUrl(shareId);

  const isError = shareProfileQuery.isError;
  const isLoading = shareProfileQuery.isLoading;
  const isActionDisabled = isError || isLoading;

  const onCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showSuccessSnackbar('Link copied');
    } catch {
      showErrorSnackbar('Failed to copy link');
    }
  };

  const onShare = async () => {
    try {
      const blob = await ky.get(shareUrl).blob();
      const imageFile = new File([blob], `${shareId}.png`, { type: 'image/png' });
      const shareData = { files: [imageFile] };

      if ('canShare' in navigator) {
        if (!navigator.canShare(shareData)) return showErrorSnackbar('Failed to share image');
      }

      await navigator.share(shareData);
    } catch (error: unknown) {
      if ((error as Error).name === 'AbortError') return;
      showErrorSnackbar('Failed to share image');
    }
  };

  const onClose = () => {
    closeDialog();
    queryClient.removeQueries({ queryKey: ['shareProfile'] });
  };

  return (
    <BaseDialog title="Share profile" open={visible} maxWidth={'md'} onClose={onClose}>
      <DialogContent sx={{ pt: 0 }}>
        {isLoading ? (
          <GridLegacy
            container
            sx={{
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </GridLegacy>
        ) : null}
        {shareId ? (
          <img
            draggable="false"
            alt="Profile share"
            crossOrigin="anonymous"
            src={shareUrl}
            style={{ width: '100%' }}
          />
        ) : null}
        {isError ? <Typography component="p">Failed to load image</Typography> : null}
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
