import { describe, it, expect } from 'vitest';
import formatDate from './formatDate';

describe('formatDate', () => {
  it('formats a date string to "MM/DD" format', () => {
    const dateString = '2024-03-06T12:00:00Z';
    const formattedDate = formatDate(dateString);
    expect(formattedDate).toBe('3/6');
  });
});