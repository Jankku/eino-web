import { capitalize, Chip, Container } from '@mui/material';
import { DataGrid, GridToolbar, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { dateValueFormatter } from '../../utils/tableUtils';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import Head from '../../components/common/Head';
import { useState } from 'react';
import { useAllBulletins } from '../../data/admin/useAllBulletins';

const slots = { toolbar: GridToolbar };

const slotProps = { toolbar: { showQuickFilter: true } };

const initialState: GridInitialStateCommunity = {
  density: 'compact',
  sorting: { sortModel: [{ field: 'created_on', sort: 'desc' }] },
  pagination: {
    paginationModel: { pageSize: 25, page: 0 },
  },
};

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
];

export default function Bulletins() {
  const { data } = useAllBulletins();
  const [rowId, setRowId] = useState<GridRowId>();

  return (
    <>
      <Container maxWidth="xl" sx={{ paddingBottom: 4 }}>
        <Head pageTitle="Bulletins" />
        <h1>Bulletins</h1>
        <Box height={500}>
          <DataGrid
            disableRowSelectionOnClick
            rows={data}
            columns={columns}
            slots={slots}
            slotProps={slotProps}
            initialState={initialState}
            onCellDoubleClick={({ field, id }) => {
              if (field === 'old_data' || field === 'new_data') {
                setRowId(id);
              }
            }}
          />
        </Box>
      </Container>
    </>
  );
}
