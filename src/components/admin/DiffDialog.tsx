import DialogFooter from '../common/DialogFooter';
import { Box, Button, DialogContent, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { Change, diffJson } from 'diff';
import CodeBlock from '../common/CodeBlock';

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
  const diff = diffJson(oldData, newData);
  const diffElements = diff.map((part, index) => (
    <Box
      // oxlint-disable-next-line @eslint-react/no-array-index-key
      key={index}
      component="span"
      sx={(theme) =>
        part.added
          ? {
              backgroundColor: theme.vars.palette.success.light,
              color: theme.vars.palette.success.contrastText,
              ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.success.dark,
              }),
            }
          : part.removed
            ? {
                backgroundColor: theme.vars.palette.error.light,
                color: theme.vars.palette.error.contrastText,
                ...theme.applyStyles('dark', {
                  backgroundColor: theme.vars.palette.error.dark,
                }),
              }
            : {}
      }
    >
      {part.value === '{}' ? undefined : part.value}
    </Box>
  ));

  return (
    <BaseDialog title="Diff of new and old row data" open={visible} onClose={onClose}>
      <DialogContent sx={{ pt: 0 }}>
        {isDiffNotEmpty(diff) ? (
          <CodeBlock>{diffElements}</CodeBlock>
        ) : (
          <Typography>No changes to show.</Typography>
        )}
      </DialogContent>
      <DialogFooter>
        <Button color="inherit" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </BaseDialog>
  );
}
