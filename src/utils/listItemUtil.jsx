import DoneIcon from '@mui/icons-material/Done';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CloseIcon from '@mui/icons-material/Close';
import BookIcon from '@mui/icons-material/Book';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import UpdateIcon from '@mui/icons-material/Update';

export default function getStatusIcon(status, color) {
  switch (status) {
    case 'reading':
      return <BookIcon color={color} data-testid="reading" />;
    case 'watching':
      return <LocalMoviesIcon color={color} data-testid="watching" />;
    case 'completed':
      return <DoneIcon color={color} data-testid="completed" />;
    case 'on-hold':
      return <UpdateIcon color={color} data-testid="on-hold" />;
    case 'dropped':
      return <CloseIcon color={color} data-testid="dropped" />;
    case 'planned':
      return <ScheduleIcon color={color} data-testid="planned" />;
  }
}
