import DoneIcon from '@mui/icons-material/Done';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CloseIcon from '@mui/icons-material/Close';
import BookIcon from '@mui/icons-material/Book';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import UpdateIcon from '@mui/icons-material/Update';
import { SvgIconOwnProps } from '@mui/material/SvgIcon/SvgIcon';
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
  const { palette } = theme;
  const isDark = palette.mode === 'dark';
  const variant = isDark ? 'light' : 'dark';
  switch (status) {
    case 'reading':
      return palette.primary[variant];
    case 'watching':
      return palette.primary[variant];
    case 'completed':
      return palette.success[variant];
    case 'on-hold':
      return isDark ? palette.warning[variant] : 'text.primary';
    case 'dropped':
      return palette.error[variant];
    case 'planned':
      return palette.text.primary;
  }
}
