import { focusNavigationTarget, useNavigationFocus } from '../../hooks/useNavigationFocus';
import { useCallback, useMemo } from 'react';
import { Outlet } from 'react-router';
import Drawer from './Drawer';
import Appbar from './Appbar';
import OfflineAlert from '../common/OfflineAlert';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useLocalStorage, useToggle } from '@uidotdev/usehooks';
import Bulletins from '../common/Bulletins';
import { Box, useMediaQuery, useTheme } from '@mui/material';

export default function Layout() {
  useNavigationFocus();
  const isMobile = useIsMobile();
  const { breakpoints } = useTheme();
  const matchesXxl = useMediaQuery(breakpoints.only('xxl'));
  const [drawerOpen, setDrawerOpen] = useToggle(false);
  const [drawerExpanded, setDrawerExpansed] = useLocalStorage('drawerExpanded', false);
  const toggleDrawer = useCallback(() => setDrawerOpen(), [setDrawerOpen]);

  const drawerWidth = useMemo(
    () => (isMobile ? 240 : !drawerExpanded ? 64 : matchesXxl ? 240 : 210),
    [isMobile, drawerExpanded, matchesXxl],
  );

  return (
    <>
      <Box
        component="a"
        href="#main-content"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById('main-content');
          if (main) focusNavigationTarget(main);
        }}
      >
        Skip to main content
      </Box>
      <Bulletins drawerWidth={drawerWidth} />
      <OfflineAlert drawerWidth={drawerWidth} />
      <Appbar drawerOpen={drawerOpen} drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />
      <Drawer
        drawerWidth={drawerWidth}
        drawerOpen={drawerOpen}
        drawerExpanded={drawerExpanded}
        onDrawerExpand={() => setDrawerExpansed((oldValue) => !oldValue)}
        toggleDrawer={toggleDrawer}
      >
        <Outlet />
      </Drawer>
    </>
  );
}
