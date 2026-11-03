import { getRowActions } from '../../components/admin/getRowActions';
import ListPagination from '../../components/common/ListPagination';
import { useServerPagination, useRecoverPage } from '../../hooks/useServerPagination';
import { Button, capitalize, Chip, Container, Stack } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridEventListener,
  GridRowEditStopReasons,
  GridInitialState,
} from '@mui/x-data-grid';
import AdminTableFrame from '../../components/admin/AdminTableFrame';
import { dateToISOStringParser, dateValueFormatter } from '../../utils/tableUtils';
import Head from '../../components/common/Head';
import { useAllBulletins } from '../../data/admin/useAllBulletins';
import AddIcon from '@mui/icons-material/Add';
import CreateBulletinDialog from '../../components/admin/CreateBulletinDialog';
import { useToggle } from '@uidotdev/usehooks';
import { useCallback, useMemo, useState } from 'react';
import DeleteBulletinDialog from '../../components/admin/DeleteBulletinDialog';
import { bulletinVisibilities, DbBulletin } from '../../models/bulletin';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { updateBulletinSchema, useUpdateBulletin } from '../../data/admin/useUpdateBulletin';
import { parseError } from '../../utils/zodUtil';
import { HTTPError } from 'ky';

const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
  }
};

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
  columns: {
    columnVisibilityModel: {
      name: false,
      condition: false,
      updated_on: false,
    },
  },
};

const getRowId = (row: DbBulletin) => row.id;

export default function Bulletins() {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const pageParams = useServerPagination(25);
  const { data: response, isFetching } = useAllBulletins(pageParams);
  const { results: data, pagination } = response;
  useRecoverPage(pagination);
  const updateBulletin = useUpdateBulletin();
  const [createBulletinDialogVisible, toggleCreateBulletinDialog] = useToggle(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rowIdToDelete, setRowIdToDelete] = useState<string>();

  const processRowUpdate = useCallback(
    (newRow: DbBulletin, oldRow: DbBulletin) => {
      const parsedBulletin = updateBulletinSchema.parse({
        ...newRow,
        condition: newRow.visibility === 'condition' ? newRow.condition : null,
      });
      updateBulletin.mutate(parsedBulletin, {
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
    [showErrorSnackbar, showSuccessSnackbar, updateBulletin],
  );

  const processRowUpdateError = useCallback(
    (error: Error) => showErrorSnackbar(error.message),
    [showErrorSnackbar],
  );

  const handleRowModesModelChange = useCallback((newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'title', headerName: 'Title', width: 150, editable: true, hideSortIcons: true },
      { field: 'message', headerName: 'Message', width: 250, editable: true, hideSortIcons: true },
      { field: 'name', headerName: 'Name', width: 80, editable: true, hideSortIcons: true },
      {
        field: 'type',
        headerName: 'Type',
        width: 90,
        editable: true,
        hideSortIcons: true,
        type: 'singleSelect',
        valueOptions: [
          { value: 'success', label: 'Success' },
          { value: 'info', label: 'Info' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ],
        renderCell: ({ row }) => (
          <Chip
            color="default"
            variant="filled"
            size="small"
            label={capitalize(row.type)}
            sx={{ height: 23 }}
          />
        ),
      },
      {
        field: 'visibility',
        headerName: 'Visibility',
        minWidth: 150,
        editable: true,
        hideSortIcons: true,
        type: 'singleSelect',
        valueOptions: bulletinVisibilities.map((visibility) => ({
          value: visibility,
          label: capitalize(visibility),
        })),
        renderCell: ({ row }) => (
          <Chip
            color="default"
            variant="filled"
            size="small"
            label={capitalize(row.visibility)}
            sx={{ height: 23 }}
          />
        ),
      },
      {
        field: 'condition',
        editable: true,
        hideSortIcons: true,
        headerName: 'Condition',
        minWidth: 100,
      },
      {
        field: 'start_date',
        headerName: 'Start date',
        editable: true,
        hideSortIcons: true,
        width: 160,
        type: 'dateTime',
        valueFormatter: dateValueFormatter,
        valueParser: dateToISOStringParser,
      },
      {
        field: 'end_date',
        headerName: 'End date',
        editable: true,
        hideSortIcons: true,
        width: 160,
        type: 'dateTime',
        valueFormatter: dateValueFormatter,
        valueParser: dateToISOStringParser,
      },
      {
        field: 'created_on',
        headerName: 'Created',
        width: 160,
        valueFormatter: dateValueFormatter,
      },
      {
        field: 'updated_on',
        headerName: 'Updated',
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
        getActions: ({ id }) =>
          getRowActions(id, rowModesModel, setRowModesModel, (id) =>
            setRowIdToDelete(id as string),
          ),
      },
    ],
    [rowModesModel],
  );

  return (
    <>
      <Container maxWidth="xl" sx={{ paddingBottom: 4 }}>
        <Head pageTitle="Bulletins" />
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Bulletins</h1>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={toggleCreateBulletinDialog as () => void}
          >
            Create
          </Button>
        </Stack>
        <AdminTableFrame
          label="Bulletins"
          pagination={
            <ListPagination pagination={pagination} loading={isFetching} label="Bulletins" />
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
            getRowId={getRowId}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={processRowUpdateError}
            slotProps={slotProps}
            initialState={initialState}
          />
        </AdminTableFrame>
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
