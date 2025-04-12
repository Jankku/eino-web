import { lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useCustomSnackbar } from './hooks/useCustomSnackbar';
import Home from './pages/Home';
import Layout from './components/layout/Layout';
import RequireAuth from './components/common/RequireAuth';
import RequireAdmin from './components/common/RequireAdmin';
import PageBoundary from './components/common/PageBoundary';
import Logout from './pages/authentication/Logout';
import Error404 from './components/errors/Error404';
import RedirectAuthenticated from './components/common/RedirectAuthenticated';

const Register = lazy(() => import('./pages/authentication/Register'));
const Login = lazy(() => import('./pages/authentication/Login'));
const LoginVerify2FA = lazy(() => import('./pages/authentication/LoginVerify2FA'));
const ForgotPassword = lazy(() => import('./pages/authentication/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/authentication/ResetPassword'));
const Books = lazy(() => import('./pages/books/Books'));
const BookDetail = lazy(() => import('./pages/books/BookDetail'));
const Movies = lazy(() => import('./pages/movies/Movies'));
const MovieDetail = lazy(() => import('./pages/movies/MovieDetail'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const ProfileVerifyEmail = lazy(() => import('./pages/profile/ProfileVerifyEmail'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));

const Users = lazy(() => import('./pages/admin/Users'));
const AuditLog = lazy(() => import('./pages/admin/AuditLog'));
const Bulletins = lazy(() => import('./pages/admin/Bulletins'));

export const clearQueryClientChannel = {
  name: 'queryClientChannel',
  message: 'clearQueryClient',
};

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
            staleTime: 20 * 1000,
            retry: 2,
          },
        },
      }),
  );

  useEffect(() => {
    const channel = new BroadcastChannel(clearQueryClientChannel.name);
    channel.onmessage = (event) => {
      if (event.data === clearQueryClientChannel.message) {
        queryClient.clear();
      }
    };

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
      <ReactQueryDevtools />
      <WrappedApp />
    </QueryClientProvider>
  );
}

function WrappedApp() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/register"
            element={
              <RedirectAuthenticated>
                <PageBoundary>
                  <Register />
                </PageBoundary>
              </RedirectAuthenticated>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticated>
                <PageBoundary>
                  <Login />
                </PageBoundary>
              </RedirectAuthenticated>
            }
          />
          <Route
            path="/login/2fa"
            element={
              <RedirectAuthenticated>
                <PageBoundary>
                  <LoginVerify2FA />
                </PageBoundary>
              </RedirectAuthenticated>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticated>
                <PageBoundary>
                  <ForgotPassword />
                </PageBoundary>
              </RedirectAuthenticated>
            }
          />
          <Route
            path="/reset-password"
            element={
              <RedirectAuthenticated>
                <PageBoundary>
                  <ResetPassword />
                </PageBoundary>
              </RedirectAuthenticated>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <PageBoundary>
                  <Settings />
                </PageBoundary>
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <PageBoundary>
                  <Profile />
                </PageBoundary>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/verify-email"
            element={
              <RequireAuth>
                <PageBoundary>
                  <ProfileVerifyEmail />
                </PageBoundary>
              </RequireAuth>
            }
          />
          <Route
            path="books"
            element={
              <RequireAuth>
                <PageBoundary>
                  <Books />
                </PageBoundary>
              </RequireAuth>
            }
          >
            <Route
              path=":bookId"
              element={
                <PageBoundary>
                  <BookDetail />
                </PageBoundary>
              }
            />
          </Route>
          <Route
            path="movies"
            element={
              <RequireAuth>
                <PageBoundary>
                  <Movies />
                </PageBoundary>
              </RequireAuth>
            }
          >
            <Route
              path=":movieId"
              element={
                <PageBoundary>
                  <MovieDetail />
                </PageBoundary>
              }
            />
          </Route>

          <Route
            path="users"
            element={
              <RequireAuth>
                <RequireAdmin>
                  <PageBoundary>
                    <Users />
                  </PageBoundary>
                </RequireAdmin>
              </RequireAuth>
            }
          />

          <Route
            path="audits"
            element={
              <RequireAuth>
                <RequireAdmin>
                  <PageBoundary>
                    <AuditLog />
                  </PageBoundary>
                </RequireAdmin>
              </RequireAuth>
            }
          />

          <Route
            path="bulletins"
            element={
              <RequireAuth>
                <RequireAdmin>
                  <PageBoundary>
                    <Bulletins />
                  </PageBoundary>
                </RequireAdmin>
              </RequireAuth>
            }
          />

          <Route path="/*" element={<Error404 />} />
        </Route>
      </Routes>
    </div>
  );
}
