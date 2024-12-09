type HeadProps = {
  pageTitle: string;
};

export default function Head({ pageTitle }: HeadProps) {
  const title = pageTitle ? `${pageTitle} | Eino` : 'Eino';
  return <title>{title}</title>;
}
