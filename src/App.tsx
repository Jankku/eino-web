import { lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCustomSnackbar } from './hooks/useCustomSnackbar';
import Home from './pages/Home';
import Layout from './components/layout/Layout';
import RequireAuth from './components/common/RequireAuth';
import RequireAdmin from './components/common/RequireAdmin';
import PageBoundary from './components/common/PageBoundary';
import Logout from './pages/authentication/Logout';
import Error404 from './components/errors/Error404';
import RedirectAuthenticated from './components/common/RedirectAuthenticated';
import { clearQueryClientChannel } from './utils/queryClientChannel';

const Register = lazy(() => import('./pages/authentication/Register'));
const Login = lazy(() => import('./pages/authentication/Login'));
const LoginVerify2FA = lazy(() => import('./pages/authentication/LoginVerify2FA'));
const ForgotPassword = lazy(() => import('./pages/authentication/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/authentication/ResetPassword'));
const Books = lazy(() => import('./pages/books/Books'));
const BookScanner = lazy(() => import('./pages/books/BookScanner'));
const BookDetail = lazy(() => import('./pages/books/BookDetail'));
const Movies = lazy(() => import('./pages/movies/Movies'));
const MovieDetail = lazy(() => import('./pages/movies/MovieDetail'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const ProfileVerifyEmail = lazy(() => import('./pages/profile/ProfileVerifyEmail'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));

const Overview = lazy(() => import('./pages/admin/Overview'));
const Users = lazy(() => import('./pages/admin/Users'));
const AuditLog = lazy(() => import('./pages/admin/AuditLog'));
const Bulletins = lazy(() => import('./pages/admin/Bulletins'));
const DiscordAudit = lazy(() => import('./pages/admin/DiscordAudit'));

export default function App() {
  const { showErrorSnackbar } = useCustomSnackbar();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.state.data !== undefined) {
              showErrorSnackbar(`Something went wrong: ${error?.message}`);
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 60 seconds
            retry: 2,
          },
        },
      }),
  );

  useEffect(() => {
    const channel = new BroadcastChannel(clearQueryClientChannel.name);
    channel.addEventListener('message', (event) => {
      if (event.data === clearQueryClientChannel.message) {
        queryClient.clear();
      }
    });

    return () => {
      channel.close();
    };
  }, [queryClient]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    document.addEventListener('keydown', focusSearch);
    return () => {
      document.removeEventListener('keydown', focusSearch);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="logout" element={<Logout />} />

        <Route element={<PageBoundary />}>
          <Route path="about" element={<About />} />
        </Route>

        <Route element={<RedirectAuthenticated />}>
          <Route index element={<Home />} />
          <Route element={<PageBoundary />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="login/2fa" element={<LoginVerify2FA />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<PageBoundary />}>
            <Route path="scan" element={<BookScanner />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/verify-email" element={<ProfileVerifyEmail />} />
            <Route path="books" element={<Books />}>
              <Route
                path=":bookId"
                element={
                  <PageBoundary>
                    <BookDetail />
                  </PageBoundary>
                }
              />
            </Route>
            <Route path="movies" element={<Movies />}>
              <Route
                path=":movieId"
                element={
                  <PageBoundary>
                    <MovieDetail />
                  </PageBoundary>
                }
              />
            </Route>

            <Route path="admin" element={<RequireAdmin />}>
              <Route index element={<Overview />} />
              <Route path="users" element={<Users />} />
              <Route path="audits" element={<AuditLog />} />
              <Route path="bulletins" element={<Bulletins />} />
              <Route path="integrations/discord" element={<DiscordAudit />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
