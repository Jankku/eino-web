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

export const generateUsername = () => faker.internet.password();

export const generatePassword = () => faker.internet.password({ length: 30 });

export const generateFormBook = () => ({
  title: generateWords(),
  author: faker.person.fullName(),
  publisher: generateWords(),
  isbn: generateWords(),
  pages: faker.number.int({ min: 100, max: 1000 }).toString(),
  year: faker.number.int({ min: 1900, max: 2100 }).toString(),
  score: faker.number.int({ min: 0, max: 10 }).toString(),
  status: generateBookStatus(),
});

export const generateBook = (status) => ({
  title: generateWords(),
  author: faker.person.fullName(),
  publisher: generateWords(),
  isbn: faker.lorem.word(10),
  pages: faker.number.int({ min: 100, max: 1000 }),
  year: faker.number.int({ min: 1900, max: 2100 }),
  score: faker.number.int({ min: 0, max: 10 }),
  status: status ?? generateBookStatus(),
  start_date: faker.date.anytime(),
  end_date: faker.date.anytime(),
});

export const generateFormMovie = () => ({
  title: generateWords(),
  studio: faker.person.fullName(),
  director: faker.person.fullName(),
  writer: faker.person.fullName(),
  duration: faker.number.int({ min: 10, max: 500 }).toString(),
  year: faker.number.int({ min: 1900, max: 2100 }).toString(),
  score: faker.number.int({ min: 0, max: 10 }).toString(),
  status: generateMovieStatus(),
});

export const generateMovie = (status) => ({
  title: generateWords(),
  studio: faker.person.fullName(),
  director: faker.person.fullName(),
  writer: faker.person.fullName(),
  duration: faker.number.int({ min: 10, max: 500 }),
  year: faker.number.int({ min: 1900, max: 2100 }),
  score: faker.number.int({ min: 0, max: 10 }),
  status: status ?? generateMovieStatus(),
  start_date: faker.date.anytime(),
  end_date: faker.date.anytime(),
});
