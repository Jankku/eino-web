import DoneIcon from '@mui/icons-material/Done';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CloseIcon from '@mui/icons-material/Close';
import BookIcon from '@mui/icons-material/Book';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import UpdateIcon from '@mui/icons-material/Update';
import { SvgIconOwnProps } from '@mui/material/SvgIcon';
import { Theme } from '@mui/material';

export function getStatusIcon(status: string, color?: string) {
  switch (status) {
    case 'reading':
      return <BookIcon color={color as SvgIconOwnProps['color']} data-testid="reading" />;
    case 'watching':
      return <LocalMoviesIcon color={color as SvgIconOwnProps['color']} data-testid="watching" />;
    case 'completed':
      return <DoneIcon color={color as SvgIconOwnProps['color']} data-testid="completed" />;
    case 'on-hold':
      return <UpdateIcon color={color as SvgIconOwnProps['color']} data-testid="on-hold" />;
    case 'dropped':
      return <CloseIcon color={color as SvgIconOwnProps['color']} data-testid="dropped" />;
    case 'planned':
      return <ScheduleIcon color={color as SvgIconOwnProps['color']} data-testid="planned" />;
  }
}

export function getStatusColor(status: string, theme: Theme) {
  const { vars } = theme;
  const colors = (light: string, dark: string) => ({
    color: light,
    ...theme.applyStyles('dark', { color: dark }),
  });
  switch (status) {
    case 'reading':
    case 'watching':
      return colors(vars.palette.primary.dark, vars.palette.primary.light);
    case 'completed':
      return colors(vars.palette.success.dark, vars.palette.success.light);
    case 'on-hold':
      return colors(vars.palette.text.primary, vars.palette.warning.light);
    case 'dropped':
      return colors(vars.palette.error.dark, vars.palette.error.light);
    case 'planned':
      return { color: vars.palette.text.primary };
  }
}
