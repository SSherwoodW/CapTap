import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JournalEntryCard from './JournalEntryCard';

const mockEntry = {
  description: 'Mock Entry',
  range: 'Mock Range',
  journalPlayersData: [
    { playerId: 1, statCategory: 'Mock Category 1', overUnder: 'Mock Over/Under 1', value: 'Mock Value 1' },
    { playerId: 2, statCategory: 'Mock Category 2', overUnder: 'Mock Over/Under 2', value: 'Mock Value 2' }
  ]
};

describe('JournalEntryCard', () => {
  it('renders correctly with provided entry data', () => {
    render(<JournalEntryCard entry={mockEntry} />);

    expect(screen.getByText((content, element) => {
      return (
        element.tagName.toLowerCase() === 'li' &&
        content.includes('Stat Category: Mock Category 1')
      );
    })).toBeInTheDocument();

    expect(screen.getByText((content, element) => {
      return (
        element.tagName.toLowerCase() === 'li' &&
        content.includes('Stat Category: Mock Category 2')
      );
    })).toBeInTheDocument();
  });

  it('renders "No player data available" message when no player data is provided', () => {
    const entryWithoutPlayerData = { ...mockEntry, journalPlayersData: [] };
    render(<JournalEntryCard entry={entryWithoutPlayerData} />);

    expect(screen.getByText('No player data available')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<JournalEntryCard entry={mockEntry} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
