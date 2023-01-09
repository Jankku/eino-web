import { faker } from '@faker-js/faker';

export const capitalize = (string) => string[0].toUpperCase() + string.slice(1);

export const generateBookStatus = () =>
  ['reading', 'completed', 'on-hold', 'dropped', 'planned'].at(Math.floor(Math.random() * 5));

export const generateMovieStatus = () =>
  ['watching', 'completed', 'on-hold', 'dropped', 'planned'].at(Math.floor(Math.random() * 5));

const generateWords = () => {
  const words = faker.lorem.words(10);
  return words.length > 250 ? words.slice(0, 250) : words;
};

export const generateFormBook = () => ({
  title: generateWords(),
  author: faker.name.fullName(),
  publisher: generateWords(),
  isbn: generateWords(),
  pages: faker.datatype.number().toString(),
  year: faker.datatype.number().toString(),
  score: faker.datatype.number({ max: 10 }).toString(),
  status: generateBookStatus(),
});

export const generateBook = () => ({
  title: generateWords(),
  author: faker.name.fullName(),
  publisher: generateWords(),
  isbn: faker.lorem.word(10),
  pages: faker.datatype.number(),
  year: faker.datatype.number(),
  score: faker.datatype.number({ max: 10 }),
  status: generateBookStatus(),
  start_date: faker.datatype.datetime(),
  end_date: faker.datatype.datetime(),
});

export const generateFormMovie = () => ({
  title: generateWords(),
  studio: faker.name.fullName(),
  director: faker.name.fullName(),
  writer: faker.name.fullName(),
  duration: faker.datatype.number().toString(),
  year: faker.datatype.number().toString(),
  score: faker.datatype.number({ max: 10 }).toString(),
  status: generateMovieStatus(),
});

export const generateMovie = () => ({
  title: generateWords(),
  studio: faker.name.fullName(),
  director: faker.name.fullName(),
  writer: faker.name.fullName(),
  duration: faker.datatype.number(),
  year: faker.datatype.number(),
  score: faker.datatype.number({ max: 10 }),
  status: generateMovieStatus(),
  start_date: faker.datatype.datetime(),
  end_date: faker.datatype.datetime(),
});
