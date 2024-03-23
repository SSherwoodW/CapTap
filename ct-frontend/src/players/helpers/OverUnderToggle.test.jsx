import { RadioGroup } from '@headlessui/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';

import OverUnderToggle from './OverUnderToggle';

describe('OverUnderToggle', () => {
    let container;

    beforeEach(() => {
        // Set up a container for rendering the component
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        // Clean up after each test
        document.body.removeChild(container);
        container = null;
    });

    it('renders the component with default props', () => {
        render(<OverUnderToggle/>, { container });
    
        expect(container.innerHTML).toMatchSnapshot();
    });

    it('renders the component with selectedValue correctly', () => {
        const selectedValue = 'Over';

        render(<OverUnderToggle/>, { container, props: { selectedValue } });

        // Check if the correct option is selected
        expect(container.innerHTML).toMatchSnapshot();
    });

    it('calls onChange when an option is selected', () => {
        // Mock the onChange function
        const onChange = vi.fn();

        render(<OverUnderToggle onChange={onChange}/>, { container});
        screen.debug();
        // Find the radio group
        const overButton = screen.getByText('Over')
        act(() => {
            overButton.click();
        }); 

        expect(onChange).toHaveBeenCalledWith('Over');

        const underButton = screen.getByText('Under')
        act(() => {
            underButton.click();
        }); 

        expect(onChange).toHaveBeenCalledWith('Under');
    });
});
