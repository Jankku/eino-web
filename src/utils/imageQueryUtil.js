export const formatBookSearchQuery = (title, author) => {
  const query = [];
  if (author) query.push(author);
  if (title) query.push(title);
  return query.join(' ');
};
