import { useCallback, useMemo } from 'react';
import { Outlet } from 'react-router';
import Drawer from './Drawer';
import Appbar from './Appbar';
import OfflineAlert from '../common/OfflineAlert';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useToggle } from '@uidotdev/usehooks';

export default function Layout() {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useToggle(false);
  const toggleDrawer = useCallback(() => setDrawerOpen(), [setDrawerOpen]);

  const drawerWidth = useMemo(() => (isMobile ? 240 : 210), [isMobile]);

  return (
    <>
      <OfflineAlert drawerWidth={drawerWidth} />
      <Appbar drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />
      <Drawer drawerWidth={drawerWidth} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer}>
        <Outlet />
      </Drawer>
    </>
  );
}
