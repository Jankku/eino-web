import { useLocation } from 'react-router';

type HeadProps = {
  pageTitle: string;
};

export default function Head({ pageTitle }: HeadProps) {
  const { pathname } = useLocation();
  const title = pageTitle ? `${pageTitle} | Eino` : 'Eino';
  return (
    <>
      <title>{title}</title>
      <span hidden data-route-ready={pathname} />
    </>
  );
}
