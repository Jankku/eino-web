import {
  Button,
  Box,
  Divider,
  Drawer as MuiDrawer,
  Grid,
  IconButton,
  MenuItem,
  MenuList,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Home from '@mui/icons-material/Home';
import MenuBook from '@mui/icons-material/MenuBook';
import LocalMovies from '@mui/icons-material/LocalMovies';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LoginIcon from '@mui/icons-material/Login';
import TerminalIcon from '@mui/icons-material/Terminal';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CustomNavLink from '../common/CustomNavLink.tsx';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import Footer from './Footer.tsx';
import { useIsMobile } from '../../hooks/useIsMobile.ts';

const authRouteArray = [
  { name: 'Register', path: '/register', icon: <VpnKeyIcon /> },
  { name: 'Login', path: '/login', icon: <LoginIcon /> },
];

const routeArray = [
  { name: 'Books', path: '/books', icon: <MenuBook /> },
  { name: 'Movies', path: '/movies', icon: <LocalMovies /> },
  { name: 'Profile', path: '/profile', icon: <PersonIcon /> },
  { name: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const adminRouteArray = [
  { name: 'Users', path: '/users', icon: <PersonIcon /> },
  { name: 'Audit log', path: '/audits', icon: <TerminalIcon /> },
  { name: 'Bulletins', path: '/bulletins', icon: <NotificationsIcon /> },
];

type DrawerProps = {
  drawerWidth: number;
  drawerOpen: boolean;
  toggleDrawer: () => void;
  drawerExpanded: boolean;
  onDrawerExpand: () => void;
  children: React.ReactNode;
};

export default function Drawer({
  drawerWidth,
  drawerOpen,
  toggleDrawer,
  drawerExpanded,
  onDrawerExpand,
  children,
}: DrawerProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { username, role, isLoggedIn } = useAuthContext();

  const isAdmin = role === 'admin';
  const isNavLinkSmall = isMobile ? false : !drawerExpanded;

  const drawerItems = (
    <>
      <MenuList disablePadding sx={{ px: 1 }}>
        <CustomNavLink
          toggleDrawer={toggleDrawer}
          isSmall={isNavLinkSmall}
          item={{ name: 'Home', path: '/', icon: <Home /> }}
        />

        {isLoggedIn && isAdmin
          ? [
              <Divider key={99} />,
              adminRouteArray.map((item, index) => (
                <CustomNavLink
                  toggleDrawer={toggleDrawer}
                  isSmall={isNavLinkSmall}
                  item={item}
                  key={index}
                />
              )),
              <Divider key={999} />,
            ]
          : null}

        {isLoggedIn
          ? routeArray.map((item, index) => (
              <CustomNavLink
                toggleDrawer={toggleDrawer}
                isSmall={isNavLinkSmall}
                item={item}
                key={index}
              />
            ))
          : null}

        {!isNavLinkSmall ? <Divider /> : undefined}

        {!isLoggedIn ? (
          <>
            {authRouteArray.map((item, index) => (
              <CustomNavLink
                toggleDrawer={toggleDrawer}
                isSmall={isNavLinkSmall}
                item={item}
                key={index}
              />
            ))}
          </>
        ) : null}

        {isLoggedIn && !isNavLinkSmall ? (
          <Grid sx={{ justifyContent: 'space-between' }}>
            <Grid item>
              <MenuItem sx={{ mt: 0.5 }}>
                <Typography noWrap sx={{ fontWeight: 500 }}>
                  {username}
                </Typography>
              </MenuItem>
            </Grid>

            <Grid item>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<LogoutIcon />}
                onClick={() => navigate('/logout')}
              >
                Log out
              </Button>
            </Grid>
          </Grid>
        ) : undefined}
      </MenuList>
      {!isNavLinkSmall ? (
        <Grid container sx={{ flexGrow: 1, justifyContent: 'center' }}>
          <Grid item sx={{ alignSelf: 'flex-end' }}>
            <Footer toggleDrawer={toggleDrawer} />
          </Grid>
        </Grid>
      ) : undefined}
    </>
  );

  const mobileDrawer = (
    <MuiDrawer
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      open={drawerOpen}
      onClose={toggleDrawer}
    >
      {drawerItems}
    </MuiDrawer>
  );

  const permanentDrawer = (
    <MuiDrawer
      variant="permanent"
      anchor="left"
      sx={(theme) => ({
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          transition: 'width 0.2s',
          ...theme.applyStyles('dark', {
            bgcolor: 'background.default',
          }),
        },
      })}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 2, pb: 1 }}>
        {drawerExpanded ? (
          <Button
            variant="text"
            color="inherit"
            startIcon={drawerExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            onClick={onDrawerExpand}
          >
            Collapse
          </Button>
        ) : (
          <Tooltip arrow title={<Typography variant="body2">Expand</Typography>} placement="right">
            <IconButton onClick={onDrawerExpand} sx={{ justifyContent: 'center' }}>
              {drawerExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {drawerItems}
    </MuiDrawer>
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box
          component="nav"
          sx={{
            width: { md: drawerWidth },
            flexShrink: { lg: 0 },
            transition: 'width 0.2s',
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
            transition: 'width 0.2s',
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
