import DoneIcon from '@mui/icons-material/Done';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CloseIcon from '@mui/icons-material/Close';
import BookIcon from '@mui/icons-material/Book';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import UpdateIcon from '@mui/icons-material/Update';

export default function getStatusIcon(status) {
  switch (status) {
    case 'reading':
      return <BookIcon />;
    case 'watching':
      return <LocalMoviesIcon />;
    case 'completed':
      return <DoneIcon />;
    case 'on-hold':
      return <UpdateIcon />;
    case 'dropped':
      return <CloseIcon />;
    case 'planned':
      return <ScheduleIcon />;
  }
}
