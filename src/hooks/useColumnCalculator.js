import { useTheme } from '@mui/system';
import { useMediaQuery } from '@mui/material';

const useColumnCalculator = () => {
  const { breakpoints } = useTheme();

  const matchesXl = useMediaQuery(breakpoints.only('xl'));
  const matchesLg = useMediaQuery(breakpoints.only('lg'));
  const matchesMd = useMediaQuery(breakpoints.up('md'));
  const matchesSm = useMediaQuery(breakpoints.only('sm'));
  const matchesXs = useMediaQuery(breakpoints.only('xs'));

  if (matchesXl) return 3;
  else if (matchesLg) return 2;
  else if (matchesMd) return 1;
  else if (matchesSm) return 1;
  else if (matchesXs) return 1;
  return 1;
};

export default useColumnCalculator;
