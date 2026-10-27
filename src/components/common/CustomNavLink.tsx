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
  return (
    <Tooltip
      arrow
      disableHoverListener={!isSmall}
      disableFocusListener={!isSmall}
      title={<Typography variant="body2">{item.name}</Typography>}
      placement="right"
    >
      <MenuItem
        component={Link}
        draggable={false}
        to={item.path}
        onClick={toggleDrawer}
        selected={isActive}
        aria-label={item.name}
        aria-current={isActive ? 'page' : undefined}
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
                  bgcolor: `${theme.vars.palette.primary.main} !important`,
                  color: `${theme.vars.palette.primary.contrastText} !important`,
                }
              : { color: `${theme.vars.palette.text.primary}` },
        ]}
      >
        {item.icon}
        <ListItemText
          primary={item.name}
          slotProps={{ primary: { sx: { fontWeight: 500 } } }}
          sx={
            isSmall ? { position: 'absolute', width: 0, height: 0, overflow: 'hidden' } : undefined
          }
        />
      </MenuItem>
    </Tooltip>
  );
}
