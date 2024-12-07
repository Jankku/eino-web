/* eslint-disable react/jsx-key */
import { Avatar, capitalize, Chip, Container } from '@mui/material';
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridActionsCellItem,
  GridRowModes,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModesModel,
} from '@mui/x-data-grid';
import { Box } from '@mui/system';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import { User, useUsers } from '../../data/admin/useUsers';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { getProfilePictureUrl } from '../../utils/profileUtil';
import { useDeleteUser } from '../../data/admin/useDeleteUser';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { parseError } from '../../utils/zodUtil';
import { HTTPError } from 'ky';
import { dateValueFormatter } from '../../utils/tableUtils';
import { DateTime } from 'luxon';
import { updateUserSchema, useUpdateUser } from '../../data/admin/useUpdateUser';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import Head from '../../components/common/Head';

type UpdatedRow = User & { isNew: boolean };

const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
  }
};

const slots = { toolbar: GridToolbar };

const slotProps = { toolbar: { showQuickFilter: true } };

const initialState: GridInitialStateCommunity = {
  sorting: { sortModel: [{ field: 'username', sort: 'asc' }] },
  pagination: {
    paginationModel: { pageSize: 25, page: 0 },
  },
};

export default function Users() {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const { data } = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [rows, setRows] = useState<User[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useLayoutEffect(() => {
    setRows(data);
  }, [data]);

  const getRowId = useCallback((row: User) => row.user_id, []);

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteUser.mutate(id as string, {
      onSuccess: (message) => {
        showSuccessSnackbar(message);
      },
      onError: async (error) => {
        const errors = await parseError(error as HTTPError);
        showErrorSnackbar(errors[0].message);
      },
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.user_id === id) as UpdatedRow;
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.user_id !== id));
    }
  };

  const processRowUpdate = useCallback(
    (newRow: User, oldRow: User) => {
      const parsedUser = updateUserSchema.parse(newRow);
      updateUser.mutate(parsedUser, {
        onSuccess: (message) => {
          showSuccessSnackbar(message);
        },
        onError: async (error) => {
          const errors = await parseError(error as HTTPError);
          showErrorSnackbar(errors[0].message);
        },
      });
      return oldRow;
    },
    [showErrorSnackbar, showSuccessSnackbar, updateUser],
  );

  const processRowUpdateError = useCallback(async (error: Error) => {
    showErrorSnackbar(error.message);
  }, []);

  const handleRowModesModelChange = useCallback((newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'profile_picture_path',
        headerName: 'Profile picture',
        width: 60,
        type: 'string',
        editable: true,
        renderCell: ({ value }) => (
          <Avatar src={getProfilePictureUrl(value)} sx={{ mt: 1, width: 40, height: 40 }} />
        ),
      },
      {
        field: 'username',
        headerName: 'Username',
        minWidth: 200,
        flex: 2,
        type: 'string',
        editable: true,
      },
      {
        field: 'role_id',
        headerName: 'Role',
        width: 80,
        type: 'singleSelect',
        valueOptions: [
          { value: 1, label: 'Admin' },
          { value: 2, label: 'Basic' },
          { value: 3, label: 'Demo' },
        ],
        editable: true,
        renderCell: ({ row }) => (
          <Chip
            color="primary"
            variant="filled"
            size="small"
            label={capitalize(row.role)}
            sx={(theme) => ({
              fontWeight: 500,
              ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }),
            })}
          />
        ),
      },

      { field: 'email', headerName: 'Email', width: 200, type: 'string', editable: true },
      {
        field: 'email_verified_on',
        headerName: 'Email verified',
        width: 150,
        valueParser: (value) => DateTime.fromJSDate(value as Date).toISO(),
        valueFormatter: dateValueFormatter,
        type: 'dateTime',
        editable: true,
      },
      {
        field: 'totp_enabled_on',
        headerName: '2FA enabled',
        width: 150,
        valueFormatter: dateValueFormatter,
        type: 'dateTime',
        editable: true,
      },
      {
        field: 'last_login_on',
        headerName: 'Last login',
        width: 150,
        valueFormatter: dateValueFormatter,
      },
      {
        field: 'created_on',
        headerName: 'Registered',
        width: 150,
        valueFormatter: dateValueFormatter,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              color="inherit"
              onClick={handleEditClick(id)}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              color="inherit"
              onClick={handleDeleteClick(id)}
            />,
          ];
        },
      },
    ],
    [rowModesModel],
  );

  return (
    <Container maxWidth="xl" sx={{ paddingBottom: 4 }}>
      <Head pageTitle="Users" />
      <h1>Users</h1>
      <Box height={500}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          editMode="row"
          disableRowSelectionOnClick
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={processRowUpdateError}
          slots={slots}
          slotProps={slotProps}
          initialState={initialState}
        />
      </Box>
    </Container>
  );
}
