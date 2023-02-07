import { useCallback, useReducer } from 'react';
import { Outlet } from 'react-router-dom';
import Drawer from './Drawer';
import Appbar from './Appbar';
import OfflineAlert from '../common/OfflineAlert';

const drawerWidth = 240;

function Layout() {
  const [drawerOpen, setDrawerOpen] = useReducer((open) => !open, false);

  const toggleDrawer = useCallback(() => setDrawerOpen(), []);

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
