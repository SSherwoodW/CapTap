import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import LoggedOutNav from './LoggedOutNav';

describe('LoggedOutNav component', () => {
    const loggedOutNavigation = [
        { name: 'Link 1', href: '#' },
        { name: 'Link 2', href: '#' },
        { name: 'Sign in', href: '/login' },
        { name: 'Sign up', href: '/signup' },
    ];

    const handleClickMock = vi.fn();

    it('should render without crashing', () => {
        render(<LoggedOutNav loggedOutNavigation={loggedOutNavigation} handleClick={handleClickMock} />);
        expect(screen.getByText('Link 1')).toBeInTheDocument();
        expect(screen.getByText('Link 2')).toBeInTheDocument();
    });

    it('should call handleClick when any link is clicked', () => {
        render(<LoggedOutNav loggedOutNavigation={loggedOutNavigation} handleClick={handleClickMock} />);
        
        const link1 = screen.getByText('Link 1');
        act(() => {
            link1.click();
        });
        expect(handleClickMock).toHaveBeenCalledWith('Link 1');
        
        const signIn = screen.getByText('Sign in');
        act(() => {
            signIn.click();
        });
        expect(handleClickMock).toHaveBeenCalledWith('Sign in');
    });
});
