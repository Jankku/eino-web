import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

const ColumnCalculator = () => {
  const theme = useTheme();

  const matchesMd = useMediaQuery(theme.breakpoints.up('md'));
  const matchesSm = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesXs = useMediaQuery(theme.breakpoints.only('xs'));

  if (matchesMd) return 3;
  else if (matchesSm) return 2;
  else if (matchesXs) return 1;
};

export default ColumnCalculator;
