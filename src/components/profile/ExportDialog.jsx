import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  LinearProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import BaseDialog from '../common/BaseDialog';
import { useExportData } from '../../data/profile/useExportData';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { createJsonBlob, generateExportFileName } from '../../utils/exportUtil';

const initialFormErrorState = { isError: false, text: ' ' };

function ExportDialog({ visible, closeDialog }) {
  const { showErrorSnackbar } = useCustomSnackbar();
  const [userPassword, setUserPassword] = useState('');
  const [formError, setFormError] = useState(initialFormErrorState);
  const exportData = useExportData();

  const clearFormError = () => setFormError(initialFormErrorState);

  const handleChange = (e) => {
    setUserPassword(e.target.value);
  };

  const downloadJsonExport = (data) => {
    try {
      const blob = createJsonBlob(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateExportFileName();
      a.click();
      URL.revokeObjectURL(url);
      resetState();
    } catch (error) {
      console.error(error);
      showErrorSnackbar('Failed to download export file');
    }
  };

  const resetState = () => {
    setUserPassword('');
    exportData.reset();
    closeDialog();
  };

  return (
    <BaseDialog
      open={visible}
      onClose={() => {
        resetState();
      }}
    >
      <DialogTitle>Export account data</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          exportData.mutate(userPassword, {
            onSuccess: (data) => {
              downloadJsonExport(data);
            },
            onError: (err) => {
              setFormError({
                isError: true,
                text: err.response.data.errors[0].message,
              });
            },
          });
        }}
      >
        <DialogContent sx={{ pt: 0 }}>
          <Typography paragraph>
            All account data is downloaded as a JSON file. Please confirm your password to continue.
          </Typography>
          {exportData.isSuccess ? (
            <Typography paragraph pb={1}>
              Download didn&apos;t work?{' '}
              <Link
                download={generateExportFileName()}
                href={URL.createObjectURL(createJsonBlob(exportData.data))}
                onClick={() => resetState()}
              >
                Click here to download
              </Link>
            </Typography>
          ) : null}
          <TextField
            autoFocus
            required
            fullWidth
            name="password"
            type="password"
            autoComplete="current-password"
            margin="none"
            label="Confirm password"
            onFocus={clearFormError}
            value={userPassword}
            onChange={handleChange}
            disabled={exportData.isLoading}
          />
          {exportData.isError ? (
            <FormHelperText error sx={{ fontSize: 14 }}>
              {formError.text}
            </FormHelperText>
          ) : null}
          <LinearProgress sx={{ display: exportData.isLoading ? 'block' : 'none' }} />
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
          <Button color="primary" disabled={exportData.isLoading} type="submit">
            Export
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}

export default ExportDialog;
