import { describe, expect, it } from 'vitest';
import getStatusIcon from '../listItemUtil';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('listItemUtil', () => {
  describe('getStatusIcon', () => {
    it.each(['reading', 'watching', 'completed', 'on-hold', 'dropped', 'planned'])(
      'should return the correct icon for status: %s',
      (status) => {
        render(getStatusIcon(status));
        expect(screen.getByTestId(status)).toBeInTheDocument();
      }
    );
  });
});
