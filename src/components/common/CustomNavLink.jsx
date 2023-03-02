import { ListItemText, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';

function CustomNavLink({ item }) {
  return (
    <NavLink to={item.path}>
      {({ isActive }) => (
        <MenuItem
          selected={isActive}
          sx={(theme) =>
            isActive
              ? {
                  bgcolor: `${theme.palette.primary.light} !important`,
                  color: `${theme.palette.primary.contrastText} !important`,
                }
              : null
          }
        >
          {item.icon}
          <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: 500 }} />
        </MenuItem>
      )}
    </NavLink>
  );
}

export default CustomNavLink;
