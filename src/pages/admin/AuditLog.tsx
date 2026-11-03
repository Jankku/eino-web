import ListPagination from '../../components/common/ListPagination';
import { useServerPagination, useRecoverPage } from '../../hooks/useServerPagination';
import { capitalize, Chip, Container, FormControlLabel, Switch } from '@mui/material';
import { DataGrid, GridColDef, GridRowId, GridInitialState } from '@mui/x-data-grid';
import { securityEventsFilter, useAuditLog } from '../../data/admin/useAuditLog';
import AdminTableFrame from '../../components/admin/AdminTableFrame';
import { dateValueFormatter, jsonValueFormatter } from '../../utils/tableUtils';
import Head from '../../components/common/Head';
import DiffDialog from '../../components/admin/DiffDialog';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { underscoreToSpace } from '../../utils/stringUtil';

const slotProps = {
  toolbar: {
    showQuickFilter: true,
    csvOptions: { disableToolbarButton: true },
    printOptions: { disableToolbarButton: true },
  },
};

const initialState: GridInitialState = {
  density: 'compact',
  sorting: { sortModel: [{ field: 'created_on', sort: 'desc' }] },
};

const columns: GridColDef[] = [
  {
    field: 'created_on',
    headerName: 'Time',
    width: 140,
    valueFormatter: dateValueFormatter,
  },
  {
    field: 'action',
    headerName: 'Action',
    width: 180,
    renderCell: ({ row }) => (
      <Chip
        color="default"
        variant="filled"
        size="small"
        label={capitalize(underscoreToSpace(row.action))}
        sx={{ height: 23 }}
      />
    ),
  },
  { field: 'actor_user_id', headerName: 'User ID', width: 150 },
  { field: 'username', headerName: 'Username', width: 150 },
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
];

export default function AuditLog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const securityEventsOnly = searchParams.get(securityEventsFilter) === 'true';
  const pageParams = useServerPagination(25);
  const { data: response, isFetching } = useAuditLog(pageParams, securityEventsOnly);
  const { results: data, pagination } = response;
  useRecoverPage(pagination);
  const [rowId, setRowId] = useState<GridRowId>();

  return (
    <>
      <Container maxWidth="xl" sx={{ paddingBottom: 4 }}>
        <Head pageTitle="Audit log" />
        <h1>Audit log</h1>
        <FormControlLabel
          label="Security events only · Last 24 hours"
          control={
            <Switch
              checked={securityEventsOnly}
              onChange={(_, checked) => {
                setRowId(undefined);
                setSearchParams((previous) => {
                  const next = new URLSearchParams(previous);
                  if (checked) next.set(securityEventsFilter, 'true');
                  else next.delete(securityEventsFilter);
                  next.delete('page');
                  return next;
                });
              }}
            />
          }
        />
        <AdminTableFrame
          label="Audit log"
          pagination={
            <ListPagination pagination={pagination} loading={isFetching} label="Audit log" />
          }
        >
          <DataGrid
            paginationMode="server"
            sortingMode="client"
            filterMode="client"
            hideFooterPagination
            rowCount={pagination.total}
            paginationModel={{ page: pageParams.page - 1, pageSize: pageParams.pageSize }}
            pageSizeOptions={[pageParams.pageSize]}
            loading={isFetching}
            disableRowSelectionOnClick
            showToolbar
            rows={data}
            columns={columns}
            slotProps={slotProps}
            initialState={initialState}
            onCellDoubleClick={({ field, id }) => {
              if (field === 'old_data' || field === 'new_data') {
                setRowId(id);
              }
            }}
          />
        </AdminTableFrame>
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
