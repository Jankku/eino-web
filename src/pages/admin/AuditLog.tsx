import { Container } from '@mui/material';
import { DataGrid, GridToolbar, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useAuditLog } from '../../data/admin/useAuditLog';
import { Box } from '@mui/system';
import { dateValueFormatter, jsonValueFormatter } from '../../utils/tableUtils';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import Head from '../../components/common/Head';
import DiffDialog from '../../components/admin/DiffDialog';
import { useState } from 'react';

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
  { field: 'username', headerName: 'Username', width: 150 },
  { field: 'action', headerName: 'Action', width: 150 },
  { field: 'table_name', headerName: 'Table', width: 80 },
  { field: 'record_id', headerName: 'Record ID', width: 100, sortable: false },
  {
    field: 'old_data',
    headerName: 'Old data',
    minWidth: 200,
    flex: 2,
    sortable: false,
    valueFormatter: jsonValueFormatter,
  },
  {
    field: 'new_data',
    headerName: 'New data',
    minWidth: 200,
    flex: 2,
    sortable: false,
    valueFormatter: jsonValueFormatter,
  },
  {
    field: 'created_on',
    headerName: 'Time',
    width: 180,
    valueFormatter: dateValueFormatter,
  },
];

export default function AuditLog() {
  const { data } = useAuditLog();
  const [rowId, setRowId] = useState<GridRowId>();

  return (
    <>
      <Container maxWidth="xl" sx={{ paddingBottom: 4 }}>
        <Head pageTitle="Audit log" />
        <h1>Audit log</h1>
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
      <DiffDialog
        visible={!!rowId}
        onClose={() => setRowId(undefined)}
        oldData={data.find((row) => row.id === rowId)?.old_data || {}}
        newData={data.find((row) => row.id === rowId)?.new_data || {}}
      />
    </>
  );
}
