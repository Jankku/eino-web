import { Avatar, capitalize, Chip, Container } from '@mui/material';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { DateTime } from 'luxon';
import { User, useUsers } from '../../data/admin/useUsers';
import { useCallback } from 'react';
import { getProfilePictureUrl } from '../../utils/profileUtil';

const dateValueFormatter = (value: string) =>
  value ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT) : '';

const columns: GridColDef[] = [
  {
    field: 'profile_picture_path',
    headerName: 'Profile picture',
    width: 60,
    renderCell: ({ value }) =>
      value ? (
        <Avatar src={getProfilePictureUrl(value)} sx={{ mt: 1, width: 40, height: 40 }} />
      ) : undefined,
  },
  { field: 'username', headerName: 'Username', minWidth: 200, flex: 2 },
  {
    field: 'role',
    headerName: 'Role',
    width: 80,
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

  { field: 'email', headerName: 'Email', width: 200 },
  {
    field: 'email_verified_on',
    headerName: 'Email verified',
    width: 150,
    valueFormatter: dateValueFormatter,
  },
  {
    field: 'totp_enabled_on',
    headerName: '2FA enabled',
    width: 150,
    valueFormatter: dateValueFormatter,
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
];

export default function Users() {
  const { data } = useUsers();

  const getRowId = useCallback((row: User) => row.user_id, []);

  return (
    <Container maxWidth="xl" sx={{ paddingBottom: 4 }}>
      <h1>Users</h1>
      <Box height={500}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={getRowId}
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
