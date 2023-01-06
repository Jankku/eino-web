import { faker } from '@faker-js/faker';

export const capitalize = (string) => string[0].toUpperCase() + string.slice(1);

export const generateBookStatus = () =>
  ['reading', 'completed', 'on-hold', 'dropped', 'planned'].at(Math.floor(Math.random() * 5));

export const generateMovieStatus = () =>
  ['watching', 'completed', 'on-hold', 'dropped', 'planned'].at(Math.floor(Math.random() * 5));

export const generateBook = () => ({
  title: faker.lorem.word(10),
  author: faker.name.fullName(),
  publisher: faker.lorem.word(10),
  isbn: faker.lorem.word(10),
  pages: faker.datatype.number().toString(),
  year: faker.datatype.number().toString(),
  score: faker.datatype.number({ max: 10 }).toString(),
  status: generateBookStatus(),
});

export const generateMovie = () => ({
  title: faker.lorem.word(10),
  studio: faker.name.fullName(),
  director: faker.name.fullName(),
  writer: faker.name.fullName(),
  duration: faker.datatype.number().toString(),
  year: faker.datatype.number().toString(),
  score: faker.datatype.number({ max: 10 }).toString(),
  status: generateMovieStatus(),
});
