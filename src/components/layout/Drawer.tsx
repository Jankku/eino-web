import { Button, Divider, Drawer, Grid, MenuItem, MenuList, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Home from '@mui/icons-material/Home';
import MenuBook from '@mui/icons-material/MenuBook';
import LocalMovies from '@mui/icons-material/LocalMovies';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LoginIcon from '@mui/icons-material/Login';
import TerminalIcon from '@mui/icons-material/Terminal';
import { Box } from '@mui/system';
import CustomNavLink from '../common/CustomNavLink.tsx';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import Footer from './Footer.tsx';

const routeArray = [
  { name: 'Books', path: '/books', icon: <MenuBook sx={{ mr: 1 }} /> },
  { name: 'Movies', path: '/movies', icon: <LocalMovies sx={{ mr: 1 }} /> },
  { name: 'Profile', path: '/profile', icon: <PersonIcon sx={{ mr: 1 }} /> },
];

const authRouteArray = [
  { name: 'Register', path: '/register', icon: <VpnKeyIcon sx={{ mr: 1 }} /> },
  { name: 'Login', path: '/login', icon: <LoginIcon sx={{ mr: 1 }} /> },
];

const adminRouteArray = [
  { name: 'Users', path: '/users', icon: <PersonIcon sx={{ mr: 1 }} /> },
  { name: 'Audit log', path: '/audits', icon: <TerminalIcon sx={{ mr: 1 }} /> },
];

type HeaderProps = {
  window?: () => Window;
  drawerWidth: number;
  drawerOpen: boolean;
  toggleDrawer: () => void;
  children: React.ReactNode;
};

export default function Header({
  window,
  drawerWidth,
  drawerOpen,
  toggleDrawer,
  children,
}: HeaderProps) {
  const navigate = useNavigate();
  const { username, role, isLoggedIn } = useAuthContext();

  const isAdmin = role === 'admin';

  const container = window !== undefined ? () => window().document.body : undefined;

  const drawerItems = (
    <>
      <Box role="presentation" sx={{ margin: '0em 0.5em' }}>
        <MenuList>
          <CustomNavLink
            toggleDrawer={toggleDrawer}
            item={{ name: 'Home', path: '/', icon: <Home sx={{ mr: 1 }} /> }}
          />

          {isLoggedIn && isAdmin
            ? [
                <Divider key={99} />,
                adminRouteArray.map((item, index) => (
                  <CustomNavLink toggleDrawer={toggleDrawer} item={item} key={index} />
                )),
                <Divider key={999} />,
              ]
            : null}

          {isLoggedIn
            ? routeArray.map((item, index) => (
                <CustomNavLink toggleDrawer={toggleDrawer} item={item} key={index} />
              ))
            : null}

          <Divider />

          {!isLoggedIn
            ? authRouteArray.map((item, index) => (
                <CustomNavLink toggleDrawer={toggleDrawer} item={item} key={index} />
              ))
            : null}

          {isLoggedIn ? (
            <Grid
              sx={{
                justifyContent: 'space-between',
              }}
            >
              <Grid item>
                <MenuItem sx={{ mt: 0.5 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    {username}
                  </Typography>
                </MenuItem>
              </Grid>

              <Grid item>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  color="secondary"
                  startIcon={<LogoutIcon />}
                  sx={{ mt: 1 }}
                  onClick={() => navigate('/logout')}
                >
                  Log out
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </MenuList>
      </Box>
      <Grid container sx={{ flexGrow: 1, justifyContent: 'center' }}>
        <Grid item sx={{ alignSelf: 'flex-end' }}>
          <Footer toggleDrawer={toggleDrawer} />
        </Grid>
      </Grid>
    </>
  );

  const mobileDrawer = (
    <Drawer
      container={container}
      elevation={0}
      sx={{
        display: { xs: 'block', xl: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      open={drawerOpen}
      onClose={toggleDrawer}
      ModalProps={{
        keepMounted: true,
      }}
    >
      {drawerItems}
    </Drawer>
  );

  const permanentDrawer = (
    <Drawer
      container={container}
      variant="permanent"
      anchor="left"
      sx={{
        display: { xs: 'none', xl: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
        },
      }}
    >
      {drawerItems}
    </Drawer>
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box
          component="nav"
          sx={{
            width: { xl: drawerWidth },
            flexShrink: { xl: 0 },
          }}
        >
          {mobileDrawer}
          {permanentDrawer}
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100%',
            width: { xs: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
