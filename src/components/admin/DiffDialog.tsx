import { Box, Button, DialogActions, DialogContent, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { Change, diffJson } from 'diff';
import CodeBlock from '../common/CodeBlock';
import { useMemo } from 'react';

const isDiffNotEmpty = (diff: Change[]) =>
  diff.length > 1 && diff.some((part) => part.value !== '{}');

type DeleteUserDialogProps = {
  oldData: Record<string, unknown>;
  newData: Record<string, unknown>;
  visible: boolean;
  onClose: () => void;
};

export default function DeleteUserDialog({
  oldData,
  newData,
  visible,
  onClose,
}: DeleteUserDialogProps) {
  const diff = useMemo(() => diffJson(oldData, newData), [oldData, newData]);
  const diffElements = useMemo(
    () =>
      diff.map((part, index) => (
        <Box
          key={index}
          component="span"
          sx={(theme) =>
            part.added
              ? {
                  backgroundColor: theme.palette.success.light,
                  color: theme.palette.success.contrastText,
                  ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.success.dark,
                  }),
                }
              : part.removed
                ? {
                    backgroundColor: theme.palette.error.light,
                    color: theme.palette.error.contrastText,
                    ...theme.applyStyles('dark', {
                      backgroundColor: theme.palette.error.dark,
                    }),
                  }
                : {}
          }
        >
          {part.value === '{}' ? undefined : part.value}
        </Box>
      )),
    [diff],
  );

  return (
    <BaseDialog title="Diff of new and old row data" open={visible} onClose={onClose}>
      <DialogContent sx={{ pt: 0 }}>
        {isDiffNotEmpty(diff) ? (
          <CodeBlock>{diffElements}</CodeBlock>
        ) : (
          <Typography>No changes to show.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}
