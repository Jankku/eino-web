import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/common/Footer';
import Error404 from './components/errors/Error404';
import Home from './pages/Home';
import Register from './pages/authentication/Register';
import Login from './pages/authentication/Login';
import Books from './pages/books/Books';
import BookDetail from './pages/books/BookDetail';
import Movies from './pages/movies/Movies';
import MovieDetail from './pages/movies/MovieDetail';
import Logout from './pages/authentication/Logout';
import useToken from './utils/useToken';
import Error401 from './components/errors/Error401';

const App = () => {
  function RequireAuth({ children }) {
    const { token } = useToken();
    return token ? children : <Error401 />;
  }

  return (
    <main className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/logout" element={<Logout />} />
        <Route
          exact
          path="/books"
          element={
            <RequireAuth>
              <Books />
            </RequireAuth>
          }
        />
        <Route
          exact
          path="/books/:bookId"
          element={
            <RequireAuth>
              <BookDetail />
            </RequireAuth>
          }
        />
        <Route
          exact
          path="/movies"
          element={
            <RequireAuth>
              <Movies />
            </RequireAuth>
          }
        />
        <Route
          exact
          path="/movies/:movieId"
          element={
            <RequireAuth>
              <MovieDetail />
            </RequireAuth>
          }
        />
        <Route path="/*" element={<Error404 />} />
      </Routes>
      <Footer />
    </main>
  );
};

export default App;
