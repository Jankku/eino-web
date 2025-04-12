import { ListItemText, MenuItem, Tooltip, Typography } from '@mui/material';
import { NavLink } from 'react-router';

type CustomNavLinkProps = {
  item: { name: string; path: string; icon: React.ReactNode };
  isSmall: boolean;
  toggleDrawer: () => void;
};

export default function CustomNavLink({ item, isSmall, toggleDrawer }: CustomNavLinkProps) {
  const menuItem = (isActive: boolean) => (
    <MenuItem
      sx={[
        {
          paddingY: 1.5,
          paddingX: isSmall ? 0 : 2,
          justifyContent: 'center',
        },
        !isSmall
          ? {
              gap: 1,
              borderRadius: 2,
            }
          : {},
        (theme) =>
          isActive
            ? {
                bgcolor: `${theme.vars.palette.primary.light} !important`,
                color: `${theme.vars.palette.primary.contrastText} !important`,
              }
            : {
                color: `${theme.vars.palette.text.primary}`,
              },
      ]}
    >
      {item.icon}
      <ListItemText
        primary={item.name}
        slotProps={{ primary: { fontWeight: 500 } }}
        sx={{ display: isSmall ? 'none' : 'block' }}
      />
    </MenuItem>
  );

  return (
    <Tooltip
      arrow
      disableHoverListener={!isSmall}
      disableFocusListener={!isSmall}
      title={<Typography variant="body2">{item.name}</Typography>}
      placement="right"
    >
      <NavLink draggable={false} to={item.path} onClick={toggleDrawer}>
        {({ isActive }) => <>{menuItem(isActive)}</>}
      </NavLink>
    </Tooltip>
  );
}
