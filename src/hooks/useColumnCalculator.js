import { useTheme } from '@mui/system';
import { useMediaQuery } from '@mui/material';

const useColumnCalculator = () => {
  const { breakpoints } = useTheme();

  const matchesLg = useMediaQuery(breakpoints.up('lg'));
  const matchesMd = useMediaQuery(breakpoints.up('md'));
  const matchesSm = useMediaQuery(breakpoints.up('sm'));
  const matchesXs = useMediaQuery(breakpoints.only('xs'));

  if (matchesLg) return 3;
  else if (matchesMd) return 2;
  else if (matchesSm) return 2;
  else if (matchesXs) return 1;
  return 1;
};

export default useColumnCalculator;
