import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ImageIcon from '@mui/icons-material/Image';
import { listItemTypes } from '../../hooks/useListItemType';
import ResponsiveButton from './ResponsiveButton';

type ListItemTypeButtonProps = {
  itemType: string;
  onClick: () => void;
};

export default function ListItemTypeButton({ itemType, onClick }: ListItemTypeButtonProps) {
  const Icon = itemType === listItemTypes.CARD ? ImageIcon : ViewAgendaIcon;
  const label = itemType === listItemTypes.CARD ? listItemTypes.IMAGE : listItemTypes.CARD;

  return (
    <ResponsiveButton icon={<Icon />} onClick={onClick}>
      {label}
    </ResponsiveButton>
  );
}
