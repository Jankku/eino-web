import { ListItemText, MenuItem, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom';
import { getBooksQuery } from '../../data/books/useBooks';

const preloadRoute = (queryClient, route) => {
  switch (route) {
    case '/books':
      queryClient.prefetchQuery({
        queryKey: ['books', 'all'],
        queryFn: () => getBooksQuery('all'),
      });
      break;

    default:
      break;
  }
};

function CustomNavLink({ item }) {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const resolved = useResolvedPath(item.path);
  const match = useMatch({ path: resolved.pathname, end: item.path === '/' });

  return (
    <>
      <NavLink
        to={item.path}
        onClick={() => {
          preloadRoute(queryClient, item.path);
        }}
      >
        <MenuItem
          selected={match ? true : false}
          sx={
            match && {
              bgcolor: `${theme.palette.primary.light} !important`,
              color: `${theme.palette.primary.contrastText} !important`,
            }
          }
        >
          {item.icon}
          <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: 500 }} />
        </MenuItem>
      </NavLink>
    </>
  );
}

export default CustomNavLink;
