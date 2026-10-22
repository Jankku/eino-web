import { ListItemText, MenuItem, Tooltip, Typography } from '@mui/material';
import { Link, useLocation, useMatch } from 'react-router';

type CustomNavLinkProps = {
  item: { name: string; path: string; icon: React.ReactNode; activePaths?: string[] };
  isSmall: boolean;
  toggleDrawer: () => void;
};

export default function CustomNavLink({ item, isSmall, toggleDrawer }: CustomNavLinkProps) {
  const { pathname } = useLocation();
  const isAliasActive = item.activePaths?.includes(pathname) ?? false;
  const routeMatch = useMatch({ path: item.path, end: item.path === '/' });
  const isActive = Boolean(routeMatch) || isAliasActive;
  const menuItem = (isActive: boolean) => (
    <MenuItem
      sx={[
        {
          paddingY: isSmall ? 1.5 : 1.2,
          paddingX: isSmall ? 0 : 2,
          justifyContent: 'center',
        },
        !isSmall ? { gap: 1, borderRadius: 2 } : {},
        (theme) =>
          isActive
            ? {
                bgcolor: `${theme.vars.palette.primary.light} !important`,
                color: `${theme.vars.palette.primary.contrastText} !important`,
              }
            : { color: `${theme.vars.palette.text.primary}` },
      ]}
    >
      {item.icon}
      <ListItemText
        primary={item.name}
        slotProps={{ primary: { sx: { fontWeight: 500 } } }}
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
      <Link
        draggable={false}
        to={item.path}
        onClick={toggleDrawer}
        className={isActive ? 'active' : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        {menuItem(isActive)}
      </Link>
    </Tooltip>
  );
}
