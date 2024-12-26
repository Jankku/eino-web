import { Button, capitalize, Chip, Container, Stack } from '@mui/material';
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridRowId,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { dateValueFormatter } from '../../utils/tableUtils';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import Head from '../../components/common/Head';
import { useAllBulletins } from '../../data/admin/useAllBulletins';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateBulletinDialog from '../../components/admin/CreateBulletinDialog';
import { useToggle } from '@uidotdev/usehooks';
import { useState } from 'react';
import DeleteBulletinDialog from '../../components/admin/DeleteBulletinDialog';

const slots = { toolbar: GridToolbar };

const slotProps = { toolbar: { showQuickFilter: true } };

const initialState: GridInitialStateCommunity = {
  density: 'compact',
  sorting: { sortModel: [{ field: 'created_on', sort: 'desc' }] },
  columns: {
    columnVisibilityModel: {
      name: false,
      condition: false,
    },
  },
  pagination: {
    paginationModel: { pageSize: 25, page: 0 },
  },
};

export default function Bulletins() {
  const { data } = useAllBulletins();
  const [createBulletinDialogVisible, toggleCreateBulletinDialog] = useToggle(false);
  const [rowIdToDelete, setRowIdToDelete] = useState<string>();

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'message', headerName: 'Message', width: 250 },
    { field: 'name', headerName: 'Name', width: 80 },
    {
      field: 'type',
      headerName: 'Type',
      width: 90,
      type: 'singleSelect',
      valueOptions: [
        { value: 'success', label: 'Success' },
        { value: 'info', label: 'Info' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' },
      ],
      renderCell: ({ row }) => (
        <Chip
          color={row.type}
          variant="filled"
          size="small"
          label={capitalize(row.type)}
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'visibility',
      headerName: 'Visibility',
      minWidth: 90,
      type: 'singleSelect',
      valueOptions: [
        { value: 'public', label: 'Public' },
        { value: 'user', label: 'User' },
        { value: 'condition', label: 'Condition' },
      ],
      renderCell: ({ row }) => (
        <Chip
          color="primary"
          variant="filled"
          size="small"
          label={capitalize(row.visibility)}
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'condition',
      headerName: 'Condition',
      minWidth: 100,
    },
    {
      field: 'start_date',
      headerName: 'Start date',
      width: 160,
      valueFormatter: dateValueFormatter,
    },
    {
      field: 'end_date',
      headerName: 'End date',
      width: 160,
      valueFormatter: dateValueFormatter,
    },
    {
      field: 'created_on',
      headerName: 'Created',
      width: 160,
      valueFormatter: dateValueFormatter,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      hideSortIcons: true,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const handleDeleteClick = (id: GridRowId) => () => {
          setRowIdToDelete(id as string);
        };

        return [
          <GridActionsCellItem
            key={0}
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
    <>
      <Container maxWidth="xl" sx={{ paddingBottom: 4 }}>
        <Head pageTitle="Bulletins" />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h1>Bulletins</h1>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={toggleCreateBulletinDialog as () => void}
          >
            Create
          </Button>
        </Stack>
        <Box height={500}>
          <DataGrid
            disableRowSelectionOnClick
            rows={data}
            columns={columns}
            slots={slots}
            slotProps={slotProps}
            initialState={initialState}
          />
        </Box>
      </Container>
      <CreateBulletinDialog
        visible={createBulletinDialogVisible}
        onClose={toggleCreateBulletinDialog}
      />
      <DeleteBulletinDialog
        bulletinId={rowIdToDelete!}
        bulletinName={data.find((row) => row.id === rowIdToDelete)?.title}
        visible={rowIdToDelete !== undefined}
        onClose={() => setRowIdToDelete(undefined)}
      />
    </>
  );
}
