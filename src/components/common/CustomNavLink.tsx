import { ListItemText, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';

type CustomNavLinkProps = {
  item: { name: string; path: string; icon: React.ReactNode };
  toggleDrawer: () => void;
};

export default function CustomNavLink({ item, toggleDrawer }: CustomNavLinkProps) {
  return (
    <NavLink draggable={false} to={item.path} onClick={toggleDrawer}>
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
