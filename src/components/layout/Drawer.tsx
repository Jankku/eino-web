import {
  Button,
  Box,
  Divider,
  Drawer as MuiDrawer,
  List,
  Tooltip,
  Typography,
  Link,
  Stack,
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
import InfoIcon from '@mui/icons-material/Info';
import CustomNavLink from '../common/CustomNavLink.tsx';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import { useIsMobile } from '../../hooks/useIsMobile.ts';

const authRouteArray = [
  { name: 'Register', path: '/register', icon: <VpnKeyIcon /> },
  { name: 'Login', path: '/login', icon: <LoginIcon /> },
  { name: 'About', path: '/about', icon: <InfoIcon /> },
];

const routeArray = [
  { name: 'Books', path: '/books', icon: <MenuBook /> },
  { name: 'Movies', path: '/movies', icon: <LocalMovies /> },
  { name: 'Profile', path: '/profile', icon: <PersonIcon /> },
  { name: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  { name: 'About', path: '/about', icon: <InfoIcon /> },
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
  const closeMobileDrawer = () => {
    if (isMobile && drawerOpen) toggleDrawer();
  };

  const drawerItems = (
    <>
      <Box component="nav" aria-label="Main navigation">
        <List disablePadding sx={{ px: 1 }}>
          <CustomNavLink
            toggleDrawer={closeMobileDrawer}
            isSmall={isNavLinkSmall}
            item={{ name: 'Home', path: '/home', icon: <Home />, activePaths: ['/'] }}
          />

          {isLoggedIn && isAdmin
            ? [
                <Divider component="li" key={99} />,
                adminRouteArray.map((item) => (
                  <CustomNavLink
                    toggleDrawer={closeMobileDrawer}
                    isSmall={isNavLinkSmall}
                    item={item}
                    key={item.name}
                  />
                )),
                <Divider component="li" key={999} />,
              ]
            : null}

          {isLoggedIn
            ? routeArray.map((item) => (
                <CustomNavLink
                  toggleDrawer={closeMobileDrawer}
                  isSmall={isNavLinkSmall}
                  item={item}
                  key={item.name}
                />
              ))
            : null}

          {!isNavLinkSmall ? <Divider component="li" /> : undefined}

          {!isLoggedIn ? (
            <>
              {authRouteArray.map((item) => (
                <CustomNavLink
                  toggleDrawer={closeMobileDrawer}
                  isSmall={isNavLinkSmall}
                  item={item}
                  key={item.name}
                />
              ))}
            </>
          ) : null}
        </List>
      </Box>
      {isLoggedIn && !isNavLinkSmall ? (
        <Stack direction="column" sx={{ justifyContent: 'space-between', px: 1 }}>
          <Box>
            <Box sx={{ mt: 0.5, mb: 1, paddingY: 1.2, paddingX: 2 }}>
              <Typography noWrap sx={{ fontWeight: 500 }}>
                {username}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Button
              fullWidth
              size="medium"
              variant="outlined"
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={() => navigate('/logout')}
            >
              Log out
            </Button>
          </Box>
        </Stack>
      ) : undefined}
      {!isNavLinkSmall ? (
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', width: '100%', flexGrow: 1, justifyContent: 'center' }}
        >
          <Box sx={{ alignSelf: 'flex-end' }}>
            <Typography
              component="p"
              variant="subtitle2"
              sx={{
                textAlign: 'center',
                marginBottom: '2em',
                color: 'text.secondary',
              }}
            >
              Made by{' '}
              <Link href="https://github.com/Jankku" rel="noreferrer">
                Jankku
              </Link>{' '}
              ✨
            </Typography>
          </Box>
        </Stack>
      ) : undefined}
    </>
  );

  // Preserve MUI's return focus on Escape/backdrop dismissal. On navigation the
  // route coordinator waits for this modal to unmount before placing page focus.
  const mobileDrawer = (
    <MuiDrawer
      elevation={0}
      slotProps={{
        paper: () => ({
          component: 'div',
          id: 'mobile-navigation-drawer',
          role: 'dialog',
          'aria-modal': true,
          'aria-label': 'Navigation',
        }),
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      open={isMobile && drawerOpen}
      onClose={toggleDrawer}
    >
      {drawerItems}
    </MuiDrawer>
  );

  const permanentDrawer = (
    <MuiDrawer
      variant="permanent"
      slotProps={{ paper: () => ({ component: 'div', id: 'desktop-navigation-drawer' }) }}
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
        <Tooltip
          describeChild
          arrow
          title={drawerExpanded ? '' : <Typography variant="body2">Expand</Typography>}
          placement="right"
          disableHoverListener={drawerExpanded}
          disableFocusListener={drawerExpanded}
        >
          <Button
            variant="text"
            color="inherit"
            startIcon={drawerExpanded ? <ChevronLeftIcon /> : undefined}
            aria-expanded={drawerExpanded}
            aria-controls="desktop-navigation-drawer"
            aria-label={drawerExpanded ? 'Collapse drawer' : 'Expand drawer'}
            onClick={onDrawerExpand}
            sx={{ minWidth: 40, height: 40, borderRadius: drawerExpanded ? undefined : '50%' }}
          >
            {drawerExpanded ? 'Collapse' : <ChevronRightIcon />}
          </Button>
        </Tooltip>
      </Box>
      {drawerItems}
    </MuiDrawer>
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box
          component="div"
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
          id="main-content"
          tabIndex={-1}
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
