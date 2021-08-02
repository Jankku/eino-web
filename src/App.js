import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import Error404 from './components/errors/Error404';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Books from './components/books/Books';
import BookDetail from './components/books/BookDetail';
import PrivateRoute from './components/PrivateRoute';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: '100vh',
      backgroundColor: theme.palette.background.paper,
    },
  })
);

const App = () => {
  const classes = useStyles();

  return (
    <main className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/books" comp={Books} />
        <PrivateRoute exact path="/books/:bookId" comp={BookDetail} />
        <Route path="/" component={Error404} />
      </Switch>
      <Footer />
    </main>
  );
};

export default App;
