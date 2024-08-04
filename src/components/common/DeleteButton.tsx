import { LoadingButton } from '@mui/lab';
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
    <LoadingButton
      variant="contained"
      // @ts-expect-error -- Valid
      color="secondary"
      startIcon={<DeleteIcon />}
      {...rest}
      {...getButtonProps({ onClick, onBlur })}
    >
      {doubleCheck ? 'You sure?' : 'Delete'}
    </LoadingButton>
  );
}
