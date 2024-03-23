import React from "react";
import { render, fireEvent } from '@testing-library/react';
import GameRange from './GameRange';

describe('GameRange', () => {
    it('renders the component with the correct ranges', () => {
        const { getByText } = render(<GameRange />);
        expect(getByText('L5')).toBeInTheDocument();
        expect(getByText('L10')).toBeInTheDocument();
        expect(getByText('L20')).toBeInTheDocument();
        expect(getByText('Season')).toBeInTheDocument();
    });

    it('calls handleClick function when a range button is clicked', () => {
        const handleClick = vi.fn();
        const { getByText } = render(<GameRange handleClick={handleClick} />);
        fireEvent.click(getByText('L5'));
        expect(handleClick).toHaveBeenCalledWith('L5');
    });

    it('applies selected style to the selected range button', () => {
        const selectedOption = 'L10';
        const { getByText } = render(<GameRange selectedOption={selectedOption} />);
        const selectedButton = getByText(selectedOption);
        expect(selectedButton).toHaveClass('bg-indigo-400');
    });

    it('does not apply selected style to other range buttons', () => {
        const selectedOption = 'L10';
        const { getByText } = render(<GameRange selectedOption={selectedOption} />);
        const otherButtons = ['L5', 'L20', 'Season'].map(text => getByText(text));
        otherButtons.forEach(button => {
            expect(button).not.toHaveClass('bg-indigo-400');
        });
    });
});
