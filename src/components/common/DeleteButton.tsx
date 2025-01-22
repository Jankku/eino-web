import { Button } from '@mui/material';
import { useDoubleCheck } from '../../hooks/useDoubleCheck';
import DeleteIcon from '@mui/icons-material/Delete';

type DeleteButtonProps = {
  onClick: () => void;
  onBlur?: () => void;
  [key: string]: unknown;
};

export default function DeleteButton({ onClick, onBlur, ...rest }: DeleteButtonProps) {
  const { doubleCheck, getButtonProps } = useDoubleCheck();

  return (
    <Button
      variant="contained"
      // @ts-expect-error - It's valid
      color="error"
      startIcon={<DeleteIcon />}
      {...rest}
      {...getButtonProps({ onClick, onBlur })}
    >
      {doubleCheck ? 'You sure?' : 'Delete'}
    </Button>
  );
}
