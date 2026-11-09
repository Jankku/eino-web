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
  SvgIcon,
} from '@mui/material';
import { useNavigate } from 'react-router';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Home from '@mui/icons-material/Home';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
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

function DiscordIcon() {
  return (
    <SvgIcon>
      <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.865-.609 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.618-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.582.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.011c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.01c.12.1.246.199.373.293a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.675-3.549-13.661a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </SvgIcon>
  );
}

const adminRouteArray = [
  { name: 'Overview', path: '/admin', icon: <DashboardOutlinedIcon />, end: true },
  { name: 'Users', path: '/admin/users', icon: <PersonIcon /> },
  { name: 'Audit log', path: '/admin/audits', icon: <TerminalIcon /> },
  { name: 'Discord audit', path: '/admin/integrations/discord', icon: <DiscordIcon /> },
  { name: 'Bulletins', path: '/admin/bulletins', icon: <NotificationsIcon /> },
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
