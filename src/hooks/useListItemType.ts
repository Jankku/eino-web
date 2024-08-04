import { useLocalStorage } from './useLocalStorage';

export const listItemTypes = {
  CARD: 'card',
  IMAGE: 'image',
};

export function useListItemType(key: string, defaultValue: string) {
  const [itemType, setItemType] = useLocalStorage(key, defaultValue);

  const toggleItemType = () => {
    setItemType((prev) => (prev === listItemTypes.CARD ? listItemTypes.IMAGE : listItemTypes.CARD));
  };

  return { itemType, toggleItemType };
}
