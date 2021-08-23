import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Footer from './components/common/Footer';
import Error404 from './components/errors/Error404';
import Home from './pages/Home';
import Register from './pages/authentication/Register';
import Login from './pages/authentication/Login';
import Books from './pages/books/Books';
import BookDetail from './pages/books/BookDetail';
import Movies from './pages/movies/Movies';
import MovieDetail from './pages/movies/MovieDetail';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <main className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/books" comp={Books} />
        <PrivateRoute exact path="/books/:bookId" comp={BookDetail} />
        <PrivateRoute exact path="/movies" comp={Movies} />
        <PrivateRoute exact path="/movies/:movieId" comp={MovieDetail} />
        <Route path="/" component={Error404} />
      </Switch>
      <Footer />
    </main>
  );
};

export default App;
