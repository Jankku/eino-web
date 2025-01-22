import {
  Autocomplete,
  Button,
  capitalize,
  createFilterOptions,
  DialogActions,
  DialogContent,
  Stack,
} from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { HTTPError } from 'ky';
import { parseError } from '../../utils/zodUtil';
import { FormProvider, useForm } from 'react-hook-form';
import ErrorMessage from '../authentication/ErrorMessage';
import { useCreateBulletin } from '../../data/admin/useCreateBulletin';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Bulletin,
  bulletinConditions,
  bulletinDefaults,
  bulletinSchema,
  bulletinTypes,
  bulletinVisibilities,
} from '../../models/bulletin';
import TextField from '../form/TextField';
import Select from '../form/Select';
import { useState } from 'react';
import { useFindUser, User } from '../../data/admin/useUsers';
import DateTimePicker from '../form/DateTimePicker';
import { underscoreToSpace } from '../../utils/stringUtil';

type CreateBulletinDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const filterOptions = createFilterOptions<User>({
  ignoreCase: true,
  ignoreAccents: true,
  stringify: (option) => option.username,
  trim: true,
});

export default function CreateBulletinDialog({ visible, onClose }: CreateBulletinDialogProps) {
  const { showSuccessSnackbar } = useCustomSnackbar();
  const createBulletin = useCreateBulletin();
  const formMethods = useForm({
    defaultValues: bulletinDefaults,
    resolver: zodResolver(bulletinSchema),
  });
  const {
    handleSubmit,
    setError,
    formState: { errors },
    reset,
    watch,
  } = formMethods;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelecteditem] = useState<(string | User)[]>([]);
  const { users } = useFindUser(searchTerm);
  const showUserAutocomplete = watch('visibility') === 'user';
  const showConditionSelect = watch('visibility') === 'condition';

  const onSubmit = (body: Bulletin) => {
    createBulletin.mutate(body, {
      onSuccess: (message) => {
        showSuccessSnackbar(message);
        handleClose();
      },
      onError: async (error) => {
        const errors = await parseError(error as HTTPError);
        setError('root.serverError', {
          message: errors[0].message,
        });
      },
    });
  };

  const handleClose = () => {
    onClose();
    reset(bulletinDefaults);
  };

  return (
    <BaseDialog maxWidth="xs" title="Create bulletin" open={visible} onClose={handleClose}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <TextField margin="dense" name="title" label="Title" sx={{ mb: 1 }} />
            <TextField
              multiline
              minRows={2}
              maxRows={5}
              margin="dense"
              name="message"
              label="Message"
              sx={{ mb: 1 }}
            />
            <TextField margin="dense" name="name" label="Name" sx={{ mb: 1 }} />
            <Stack direction="row" spacing={1} sx={{ my: 1 }}>
              <Select name="type" label="Type">
                {bulletinTypes.map((type, itemIdx) => (
                  <option key={itemIdx} value={type}>
                    {capitalize(type)}
                  </option>
                ))}
              </Select>
              <Select name="visibility" label="Visibility" sx={{ mb: 1 }}>
                {bulletinVisibilities.map((visibility, itemIdx) => (
                  <option key={itemIdx} value={visibility}>
                    {capitalize(visibility)}
                  </option>
                ))}
              </Select>
            </Stack>
            {showUserAutocomplete ? (
              <Autocomplete
                multiple
                limitTags={3}
                freeSolo
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                options={users}
                value={selectedItem}
                isOptionEqualToValue={(option, value) => option?.user_id === value?.user_id}
                onChange={(_event, newValue, reason) => {
                  if (['selectOption', 'removeOption'].includes(reason)) {
                    setSelecteditem(newValue);
                    setSearchTerm('');
                  }
                  if (reason === 'clear') {
                    setSelecteditem([]);
                  }
                }}
                filterOptions={filterOptions}
                getOptionLabel={(option) => (option as User)?.username ?? ''}
                inputValue={String(searchTerm)}
                onInputChange={(_e, value, reason) => {
                  if (reason === 'input') setSearchTerm(value ?? '');
                  if (['clear', 'reset'].includes(reason)) setSearchTerm('');
                }}
                renderInput={(params) => <TextField {...params} name="" label="Search users" />}
                sx={{ mb: 1 }}
              />
            ) : undefined}
            {showConditionSelect ? (
              <Select name="condition" label="Visibility condition" sx={{ mb: 1 }}>
                {bulletinConditions.map((condition, itemIdx) => (
                  <option key={itemIdx} value={condition}>
                    {capitalize(underscoreToSpace(condition))}
                  </option>
                ))}
              </Select>
            ) : undefined}
            <DateTimePicker fullWidth name="start_date" label="Start date" sx={{ mb: 1 }} />
            <DateTimePicker fullWidth name="end_date" label="End date" />
            {errors.root?.serverError?.message ? (
              <ErrorMessage message={errors.root.serverError.message} />
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button loading={createBulletin.isPending} color="primary" type="submit">
              Create
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
