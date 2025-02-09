import { useCallback, useMemo } from 'react';
import { Outlet } from 'react-router';
import Drawer from './Drawer';
import Appbar from './Appbar';
import OfflineAlert from '../common/OfflineAlert';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useLocalStorage, useToggle } from '@uidotdev/usehooks';
import Bulletins from '../common/Bulletins';

export default function Layout() {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useToggle(false);
  const [drawerExpanded, setDrawerExpansed] = useLocalStorage('drawerExpanded', false);
  const toggleDrawer = useCallback(() => setDrawerOpen(), [setDrawerOpen]);

  const drawerWidth = useMemo(
    () => (isMobile ? 240 : !drawerExpanded ? 64 : 210),
    [isMobile, drawerExpanded],
  );

  return (
    <>
      <Bulletins drawerWidth={drawerWidth} />
      <OfflineAlert drawerWidth={drawerWidth} />
      <Appbar drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />
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
