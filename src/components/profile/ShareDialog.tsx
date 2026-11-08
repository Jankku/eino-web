import DialogFooter, { DialogPrimaryButton } from '../common/DialogFooter';
import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { getShareUrl } from '../../utils/shareUtil';
import BaseDialog from '../common/BaseDialog';
import { ShareTheme, useShareprofile } from '../../data/profile/useShareProfile';
import ky from 'ky';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import SmallSelect from '../common/SmallSelect';

type ShareDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function ShareDialog({ visible, closeDialog }: ShareDialogProps) {
  const queryClient = useQueryClient();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const { palette } = useTheme();
  const [themeOverride, setThemeOverride] = useState<'app' | ShareTheme>('app');
  const shareTheme = themeOverride === 'app' ? palette.mode : themeOverride;
  const shareProfileQuery = useShareprofile(visible, shareTheme);
  const shareId = shareProfileQuery?.data;
  const shareUrl = getShareUrl(shareId);

  const isError = shareProfileQuery.isError;
  const isLoading = shareProfileQuery.isPending || shareProfileQuery.isFetching;
  const isActionDisabled = isError || isLoading || !shareId;

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
    <BaseDialog title="Share profile" open={visible} maxWidth="md" fullWidth onClose={onClose}>
      <DialogContent sx={{ pt: 0 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary" aria-hidden="true">
            Image theme
          </Typography>
          <SmallSelect
            compact
            label="Image theme"
            value={themeOverride}
            onChange={(event) => {
              const value = event.target.value;
              if (value === 'app' || value === 'light' || value === 'dark') {
                setThemeOverride(value);
              }
            }}
          >
            <option value="app">App theme ({palette.mode === 'light' ? 'Light' : 'Dark'})</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </SmallSelect>
        </Stack>
        <Box
          sx={{
            height: 'min(60dvh, 600px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isLoading ? <CircularProgress /> : null}
          {shareId && !isLoading && !isError ? (
            <img
              draggable="false"
              alt="Profile share"
              crossOrigin="anonymous"
              src={shareUrl}
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : null}
          {isError ? <Typography component="p">Failed to load image</Typography> : null}
        </Box>
      </DialogContent>
      <DialogFooter>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button color="inherit" disabled={isActionDisabled} onClick={onCopyUrl}>
          Copy link
        </Button>
        <DialogPrimaryButton disabled={isActionDisabled} onClick={onShare}>
          Share
        </DialogPrimaryButton>
      </DialogFooter>
    </BaseDialog>
  );
}
