import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import LoggedInNav from './LoggedInNav';


vi.mock("../auth/authContext", async () => {
    const mod = await vi.importActual("../auth/authContext");
    return {
        ...mod,
        useAuth: () => ({ handleLogout: vi.fn() })
    }
});

describe('LoggedInNav component', () => {
    const loggedInNavigation = [
        { name: 'Link 1', href: '#' },
        { name: 'Link 2', href: '#' },
        { name: 'Search Players' },
        { name: 'Search Teams' },
    ];

    const handleLogoutMock = vi.fn();
    const handleLinkClickMock = vi.fn();

    it('should render without crashing', () => {
        render(<LoggedInNav loggedInNavigation={loggedInNavigation} handleLogout={handleLogoutMock} />);
        expect(screen.getByText('Link 1')).toBeInTheDocument();
        expect(screen.getByText('Link 2')).toBeInTheDocument();
    });

    it('should toggle search visibility when search buttons are clicked', () => {
        render(<LoggedInNav loggedInNavigation={loggedInNavigation} handleLogout={handleLogoutMock} />);
        
        const searchPlayersButton = screen.getByText('Search Players');
        act(() => {
            searchPlayersButton.click();
        });

        const searchPlayersDiv = screen.getByTestId('players-search');
        expect(searchPlayersDiv).toBeInTheDocument();

        const searchTeamsButton = screen.getByText('Search Teams');
        act(() => {
            searchTeamsButton.click();
        });

        const searchTeamsDiv = screen.getByTestId('teams-search');
        expect(searchTeamsDiv).toBeInTheDocument();
        expect(searchPlayersDiv).not.toBeInTheDocument();
    });

    it('should hide search when other buttons are clicked', () => {
        render(<LoggedInNav loggedInNavigation={loggedInNavigation} handleLogout={handleLogoutMock} handleLinkClick={handleLinkClickMock} />);
        const searchPlayersButton = screen.getByText('Search Players');
        act(() => {
            searchPlayersButton.click();
        });
        const searchPlayersDiv = screen.getByTestId('players-search');
        expect(searchPlayersDiv).toBeInTheDocument();

        const link1 = screen.getByText('Link 1');
        act(() => {
            link1.click();
        })
        expect(searchPlayersDiv).not.toBeInTheDocument();
    });

    it('should call handleLogout when sign out button is clicked', () => {
        render(<LoggedInNav loggedInNavigation={loggedInNavigation} handleLogout={handleLogoutMock} />);

        const openUserMenuBtn = screen.getByTestId('user-menu');
        console.log(openUserMenuBtn)
        act(() => {
            openUserMenuBtn.click();
        })

        const logOutButton = screen.getByText('Sign out');
        expect(logOutButton).toBeInTheDocument();
    });
});
