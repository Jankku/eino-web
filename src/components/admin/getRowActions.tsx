import type { Dispatch, SetStateAction } from 'react';
import {
  GridActionsCellItem,
  GridRowModes,
  type GridRowId,
  type GridRowModesModel,
} from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

export function getRowActions(
  id: GridRowId,
  rowModesModel: GridRowModesModel,
  setRowModesModel: Dispatch<SetStateAction<GridRowModesModel>>,
  onDelete: (id: GridRowId) => void,
) {
  const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    onDelete(id);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  if (isInEditMode) {
    return [
      <GridActionsCellItem
        key={0}
        icon={<SaveIcon />}
        label="Save"
        color="primary"
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
}
