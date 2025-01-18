import { useEffect } from 'react';
import { useIsMobile } from './useIsMobile';

export function useRestoreItemFocus(key: string) {
  const isMobile = useIsMobile();

  const saveFocusedItem = (id: string) => {
    sessionStorage.setItem(key, id);
  };

  useEffect(() => {
    if (!isMobile) return;
    const focusedElement = document.getElementById(sessionStorage.getItem(key)!);
    focusedElement?.focus();
    sessionStorage.removeItem(key);
  }, [key, isMobile]);

  return { saveFocusedItem };
}
