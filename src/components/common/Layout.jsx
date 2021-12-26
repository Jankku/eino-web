import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function Layout() {
  return (
    <>
      <Header>
        <Outlet />
        <Footer />
      </Header>
    </>
  );
}

export default Layout;
