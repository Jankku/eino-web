import { lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useCustomSnackbar from './hooks/useCustomSnackbar';
import { getBooksQuery } from './data/books/useBooks';
import { getMoviesQuery } from './data/movies/useMovies';
import { getProfileQuery } from './data/profile/useProfile';
import { useAuthContext } from './providers/AuthenticationProvider';
import Home from './pages/Home';
import Layout from './components/layout/Layout';
import RequireAuth from './components/common/RequireAuth';
import PageBoundary from './components/common/PageBoundary';
import Logout from './pages/authentication/Logout';
import Privacy from './pages/Privacy';
import Error404 from './components/errors/Error404';
import RedirectAuthenticated from './components/common/RedirectAuthenticated';

const Register = lazy(() => import('./pages/authentication/Register'));
const Login = lazy(() => import('./pages/authentication/Login'));
const Books = lazy(() => import('./pages/books/Books'));
const BookDetail = lazy(() => import('./pages/books/BookDetail'));
const Movies = lazy(() => import('./pages/movies/Movies'));
const MovieDetail = lazy(() => import('./pages/movies/MovieDetail'));
const Profile = lazy(() => import('./pages/profile/Profile'));

function App() {
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
            suspense: true,
            staleTime: 20 * 1000,
            retry: 2,
          },
        },
      }),
  );

  const { isLoggedIn } = useAuthContext();
  useEffect(() => {
    if (isLoggedIn) {
      queryClient.prefetchQuery({
        queryKey: ['books', 'all'],
        queryFn: () => getBooksQuery('all'),
      });
      queryClient.prefetchQuery({
        queryKey: ['movies', 'all'],
        queryFn: () => getMoviesQuery('all'),
      });
      queryClient.prefetchQuery({ queryKey: ['profile'], queryFn: () => getProfileQuery() });
    }
  }, [isLoggedIn, queryClient]);

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
          <Route path="/logout" element={<Logout />} />
          <Route path="/privacy" element={<Privacy />} />
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

          <Route path="/*" element={<Error404 />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
