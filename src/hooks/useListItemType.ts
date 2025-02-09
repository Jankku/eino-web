import { useLocalStorage } from '@uidotdev/usehooks';

export const listItemTypes = {
  CARD: 'card',
  IMAGE: 'image',
};

export function useListItemType(key: string) {
  const [itemType, setItemType] = useLocalStorage(key, listItemTypes.IMAGE);

  const toggleItemType = () => {
    setItemType((prev) => (prev === listItemTypes.CARD ? listItemTypes.IMAGE : listItemTypes.CARD));
  };

  return { itemType, toggleItemType };
}
