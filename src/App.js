import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Error404 from './components/errors/Error404';
import Home from './pages/Home';
import Register from './pages/authentication/Register';
import Login from './pages/authentication/Login';
import Books from './pages/books/Books';
import BookDetail from './pages/books/BookDetail';
import Movies from './pages/movies/Movies';
import MovieDetail from './pages/movies/MovieDetail';
import Logout from './pages/authentication/Logout';
import RequireAuth from './components/common/RequireAuth';
import Layout from './components/common/Layout';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/books"
            element={
              <RequireAuth>
                <Books />
              </RequireAuth>
            }
          />
          <Route
            path="/books/:bookId"
            element={
              <RequireAuth>
                <BookDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/movies"
            element={
              <RequireAuth>
                <Movies />
              </RequireAuth>
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              <RequireAuth>
                <MovieDetail />
              </RequireAuth>
            }
          />
          <Route path="/*" element={<Error404 />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
