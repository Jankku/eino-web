import { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import scoreOptions from '../../models/score';

type CompleteDialogProps = {
  visible: boolean;
  closeDialog: () => void;
  onComplete: (score: number) => void;
};

export default function CompleteDialog({ visible, closeDialog, onComplete }: CompleteDialogProps) {
  const [score, setScore] = useState(0);

  const onCancel = () => {
    closeDialog();
    setScore(0);
  };

  const onConfirm = () => {
    onComplete(score);
    closeDialog();
    setScore(0);
  };

  return (
    <BaseDialog maxWidth="xs" title="Select score" open={visible} onClose={onCancel}>
      <DialogContent sx={{ paddingTop: 0 }}>
        <Typography variant="body1" pb={2}>
          The status will be set as completed with end date as today.
        </Typography>
        <FormControl fullWidth>
          <InputLabel variant="filled" htmlFor="score">
            Score
          </InputLabel>
          <Select
            native
            variant="filled"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            inputProps={{ id: 'score' }}
          >
            {scoreOptions.map((item, itemIdx) => (
              <option key={itemIdx} value={item.value}>
                {item.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="primary" onClick={onConfirm}>
          Complete
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}
