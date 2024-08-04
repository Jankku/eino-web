export const formatBookSearchQuery = (title: string, author: string) => {
  const query = [];
  if (author) query.push(author);
  if (title) query.push(title);
  return query.join(' ');
};
