import { ListItemText, MenuItem, useTheme } from '@mui/material';
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom';

function CustomNavLink({ item }) {
  const theme = useTheme();
  const resolved = useResolvedPath(item.path);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <>
      <NavLink to={item.path}>
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
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </MenuItem>
      </NavLink>
    </>
  );
}

export default CustomNavLink;
