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
import { DateTime } from 'luxon';
import { User, useUsers } from '../../data/admin/useUsers';
import { useCallback, useLayoutEffect, useState } from 'react';
import { getProfilePictureUrl } from '../../utils/profileUtil';
import { useDeleteUser } from '../../data/admin/useDeleteUser';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';

type UpdatedRow = User & { isNew: boolean };

const dateValueFormatter = (value: string) =>
  value ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT) : '';

export default function Users() {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const { data } = useUsers();
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
      onError: () => {
        showErrorSnackbar('Failed to delete user');
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

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow: User) => {
    const updatedRow: UpdatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.user_id === newRow.user_id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
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
      field: 'role',
      headerName: 'Role',
      width: 80,
      type: 'singleSelect',
      valueOptions: [
        { value: 'basic', label: 'Basic' },
        { value: 'admin', label: 'Admin' },
        { value: 'demo', label: 'Demo' },
      ],
      editable: true,
      renderCell: ({ value }) => (
        <Chip
          color="primary"
          variant="filled"
          size="small"
          label={capitalize(value)}
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
  ];

  return (
    <Container maxWidth="xl" sx={{ paddingBottom: 4 }}>
      <h1>Users</h1>
      <Box height={500}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
        />
      </Box>
    </Container>
  );
}
