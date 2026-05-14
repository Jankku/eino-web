const ISBN_10_REGEX = /^\d{9}[\dX]$/;
const ISBN_13_REGEX = /^(97[89])\d{10}$/;

export const normalizeIsbnInput = (value: string) => value.replace(/[^0-9Xx]/g, '').toUpperCase();

const isValidIsbn10 = (value: string) => {
  if (!ISBN_10_REGEX.test(value)) {
    return false;
  }

  const checksum = value.split('').reduce((sum, char, index) => {
    const weight = 10 - index;
    const charValue = char === 'X' ? 10 : Number(char);
    return sum + charValue * weight;
  }, 0);

  return checksum % 11 === 0;
};

const isValidIsbn13 = (value: string) => {
  if (!ISBN_13_REGEX.test(value)) {
    return false;
  }

  const checksum = value
    .split('')
    .slice(0, 12)
    .reduce((sum, char, index) => {
      const weight = index % 2 === 0 ? 1 : 3;
      return sum + Number(char) * weight;
    }, 0);

  const expectedCheckDigit = (10 - (checksum % 10)) % 10;
  const actualCheckDigit = Number(value[12]);
  return actualCheckDigit === expectedCheckDigit;
};

export const normalizeValidIsbn = (value: string) => {
  const normalized = normalizeIsbnInput(value);

  if (normalized.length === 10 && isValidIsbn10(normalized)) {
    return normalized;
  }

  if (normalized.length === 13 && isValidIsbn13(normalized)) {
    return normalized;
  }

  return null;
};
