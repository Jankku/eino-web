import { LoadingButton } from '@mui/lab';
import { useDoubleCheck } from '../../hooks/useDoubleCheck';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteButton(props) {
  const { onClick, onBlur, ...rest } = props;
  const { doubleCheck, getButtonProps } = useDoubleCheck();

  return (
    <LoadingButton
      variant="contained"
      color="secondary"
      startIcon={<DeleteIcon />}
      {...rest}
      {...getButtonProps({ onClick, onBlur })}
    >
      {doubleCheck ? 'You sure?' : 'Delete'}
    </LoadingButton>
  );
}
