import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

const ColumnCalculator = () => {
  const theme = useTheme();

  const matchesMd = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesXs = useMediaQuery(theme.breakpoints.only('xs'));

  if (matchesMd) return 3;
  else if (matchesXs) return 1;
};

export default ColumnCalculator;
