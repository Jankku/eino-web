import { Button, capitalize, Chip, Container, Stack } from '@mui/material';
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridRowId,
  GridActionsCellItem,
  GridRowModesModel,
  GridRowModes,
  GridEventListener,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { dateToISOStringParser, dateValueFormatter } from '../../utils/tableUtils';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import Head from '../../components/common/Head';
import { useAllBulletins } from '../../data/admin/useAllBulletins';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateBulletinDialog from '../../components/admin/CreateBulletinDialog';
import { useToggle } from '@uidotdev/usehooks';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import DeleteBulletinDialog from '../../components/admin/DeleteBulletinDialog';
import { DbBulletin } from '../../models/bulletin';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { updateBulletinSchema, useUpdateBulletin } from '../../data/admin/useUpdateBulletin';
import { parseError } from '../../utils/zodUtil';
import { HTTPError } from 'ky';

type UpdatedRow = DbBulletin & { isNew: boolean };

const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
  }
};

const slots = { toolbar: GridToolbar };

const slotProps = { toolbar: { showQuickFilter: true } };

const initialState: GridInitialStateCommunity = {
  density: 'compact',
  sorting: { sortModel: [{ field: 'created_on', sort: 'desc' }] },
  columns: {
    columnVisibilityModel: {
      name: false,
      condition: false,
      updated_on: false,
    },
  },
  pagination: {
    paginationModel: { pageSize: 25, page: 0 },
  },
};

const getRowId = (row: DbBulletin) => row.id;

export default function Bulletins() {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const { data } = useAllBulletins();
  const updateBulletin = useUpdateBulletin();
  const [rows, setRows] = useState<DbBulletin[]>([]);
  const [createBulletinDialogVisible, toggleCreateBulletinDialog] = useToggle(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rowIdToDelete, setRowIdToDelete] = useState<string>();

  useLayoutEffect(() => {
    setRows(data);
  }, [data]);

  const processRowUpdate = useCallback(
    (newRow: DbBulletin, oldRow: DbBulletin) => {
      const parsedBulletin = updateBulletinSchema.parse(newRow);
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
        editable: false,
        hideSortIcons: true,
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
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          const handleEditClick = (id: GridRowId) => () => {
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
          };

          const handleSaveClick = (id: GridRowId) => () => {
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
          };

          const handleDeleteClick = (id: GridRowId) => () => {
            setRowIdToDelete(id as string);
          };

          const handleCancelClick = (id: GridRowId) => () => {
            setRowModesModel({
              ...rowModesModel,
              [id]: { mode: GridRowModes.View, ignoreModifications: true },
            });

            const editedRow = rows.find((row) => row.id === id) as UpdatedRow;
            if (editedRow.isNew) {
              setRows(rows.filter((row) => row.id !== id));
            }
          };

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key={0}
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key={2}
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
              key={0}
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              color="inherit"
              onClick={handleEditClick(id)}
            />,
            <GridActionsCellItem
              key={1}
              icon={<DeleteIcon />}
              label="Delete"
              color="inherit"
              onClick={handleDeleteClick(id)}
            />,
          ];
        },
      },
    ],
    [rowModesModel, rows],
  );

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
            getRowId={getRowId}
            editMode="row"
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
