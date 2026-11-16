import { Button, ButtonProps } from '@mui/material';
import { useDoubleCheck } from '../../hooks/useDoubleCheck';
import DeleteIcon from '@mui/icons-material/Delete';

type DeleteButtonProps = Omit<ButtonProps, 'onClick' | 'onBlur' | 'children'> & {
  onClick: () => void;
  onBlur?: () => void;
};

export default function DeleteButton({ onClick, onBlur, ...rest }: DeleteButtonProps) {
  const { doubleCheck, getButtonProps } = useDoubleCheck();

  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<DeleteIcon />}
      {...rest}
      {...getButtonProps({ onClick, onBlur })}
    >
      {doubleCheck ? 'You sure?' : 'Delete'}
    </Button>
  );
}
