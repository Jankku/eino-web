import { useMediaQuery, useTheme } from '@mui/material';
import { listItemTypes } from './useListItemType';

const columns = {
  [listItemTypes.CARD]: {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 2,
    xl: 3,
  },
  [listItemTypes.IMAGE]: {
    xs: 2,
    sm: 4,
    md: 3,
    lg: 4,
    xl: 5,
  },
};

export function useColumnCalculator(itemType?: string) {
  const { breakpoints } = useTheme();

  const matchesXl = useMediaQuery(breakpoints.only('xl'));
  const matchesLg = useMediaQuery(breakpoints.only('lg'));
  const matchesMd = useMediaQuery(breakpoints.up('md'));
  const matchesSm = useMediaQuery(breakpoints.only('sm'));
  const matchesXs = useMediaQuery(breakpoints.only('xs'));

  // For home page
  if (!itemType) {
    if (matchesXl) return 3;
    else if (matchesLg) return 3;
    else if (matchesMd) return 3;
    else if (matchesSm) return 2;
    else if (matchesXs) return 1;
  }

  if (matchesXl) return columns[itemType!].xl;
  else if (matchesLg) return columns[itemType!].lg;
  else if (matchesMd) return columns[itemType!].md;
  else if (matchesSm) return columns[itemType!].sm;
  else if (matchesXs) return columns[itemType!].xs;
  return 1;
}
