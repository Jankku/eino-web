import { Button, Divider, Drawer, Grid, MenuItem, MenuList, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Home from '@mui/icons-material/Home';
import MenuBook from '@mui/icons-material/MenuBook';
import LocalMovies from '@mui/icons-material/LocalMovies';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LoginIcon from '@mui/icons-material/Login';
import { Box } from '@mui/system';
import CustomNavLink from '../common/CustomNavLink';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import Footer from './Footer';

const routeArray = [
  { name: 'Books', path: '/books', icon: <MenuBook sx={{ mr: 1 }} /> },
  { name: 'Movies', path: '/movies', icon: <LocalMovies sx={{ mr: 1 }} /> },
  { name: 'Profile', path: '/profile', icon: <PersonIcon sx={{ mr: 1 }} /> },
];

const authRouteArray = [
  { name: 'Register', path: '/register', icon: <VpnKeyIcon sx={{ mr: 1 }} /> },
  { name: 'Login', path: '/login', icon: <LoginIcon sx={{ mr: 1 }} /> },
];

export default function Header({ window, drawerWidth, drawerOpen, toggleDrawer, children }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();
  const { getUsername } = useToken();

  const container = window !== undefined ? () => window().document.body : undefined;

  const drawerItems = (
    <>
      <Box role="presentation" sx={{ margin: '0em 0.5em' }}>
        <MenuList>
          <CustomNavLink item={{ name: 'Home', path: '/', icon: <Home sx={{ mr: 1 }} /> }} />
          {isLoggedIn && routeArray.map((item, index) => <CustomNavLink item={item} key={index} />)}
          <Divider />
          {!isLoggedIn &&
            authRouteArray.map((item, index) => <CustomNavLink item={item} key={index} />)}
          {isLoggedIn && (
            <Grid justifyContent="space-between">
              <Grid item>
                <MenuItem sx={{ mt: 0.5 }}>
                  <Typography fontWeight={500} noWrap>
                    {getUsername()}
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
          )}
        </MenuList>
      </Box>
      <Grid container sx={{ flexGrow: 1, justifyContent: 'center' }}>
        <Grid item sx={{ alignSelf: 'flex-end' }}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );

  const mobileDrawer = (
    <Drawer
      container={container}
      variant="temporary"
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      anchor="left"
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
        display: { xs: 'none', md: 'block' },
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
            height: '100%',
            width: { md: drawerWidth },
            flexShrink: { md: 0 },
          }}
        >
          {mobileDrawer}
          {permanentDrawer}
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
