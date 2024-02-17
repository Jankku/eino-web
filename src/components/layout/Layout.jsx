import { useCallback, useReducer } from 'react';
import { Outlet } from 'react-router-dom';
import Drawer from './Drawer';
import Appbar from './Appbar';
import OfflineAlert from '../common/OfflineAlert';
import { useIsMobile } from '../../hooks/useIsMobile';

function Layout() {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useReducer((open) => !open, false);
  const toggleDrawer = useCallback(() => setDrawerOpen(), []);

  const drawerWidth = isMobile ? 240 : 210;

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

export default Layout;
