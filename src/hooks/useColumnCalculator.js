import { useTheme } from '@mui/system';
import { useMediaQuery } from '@mui/material';

const useColumnCalculator = () => {
  const theme = useTheme();

  const matchesLg = useMediaQuery(theme.breakpoints.up('lg'));
  const matchesMd = useMediaQuery(theme.breakpoints.up('md'));
  const matchesSm = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesXs = useMediaQuery(theme.breakpoints.only('xs'));

  if (matchesLg) return 3;
  else if (matchesMd) return 2;
  else if (matchesSm) return 2;
  else if (matchesXs) return 1;
};

export default useColumnCalculator;
