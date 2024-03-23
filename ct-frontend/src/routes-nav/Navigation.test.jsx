import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeEach, describe, it, vi } from 'vitest';
import Navigation from './Navigation';

const useLocationMock = {
        pathname: '/',
};
    
const loggedOutMock = {
    currentUser: null
}

const loggedInMock = {
    currentUser: {username: 'testUser'}
}

describe('Navigation component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    const loggedInNavigation = [
        { name: 'Home', href: '/', current: true },
        { name: 'Parlayer', href: '/parlayer', current: false },
        { name: 'Journal', href: '/journal/testUser', current: false },
        { name: 'Search Teams', href: '#', current: false },
        { name: 'Search Players', href: '#', current: false },
    ];

    const loggedOutNavigation = [
        { name: 'Home', href: '/', current: true },
        { name: 'Login', href: '/login', current: false },
        { name: 'Signup', href: '/signup', current: false },
    ];

    const setCurrentLinkMock = vi.fn();

    it('should render LoggedInNav when user is logged in', async () => {
        vi.mock("react-router-dom", () => ({
            useLocation: () => useLocationMock
        }));

        vi.mock("../auth/authContext", async () => {
            const mod = await vi.importActual('../auth/authContext');
            return {
                ...mod,
                useAuth: () => (loggedInMock)
            }
        });

        render(<Navigation />);

        loggedInNavigation.forEach(navItem => {
            const link = screen.getByText(navItem.name);
            expect(link).toBeInTheDocument();
        });

        loggedOutNavigation.forEach(navItem => {
            if (navItem.name !== 'Home') {
                const link = screen.queryByText(navItem.name);
                expect(link).not.toBeInTheDocument();
            }
        });
        vi.resetAllMocks();
    });

    it('should render LoggedOutNav when user is logged out', async () => {
        vi.mock("react-router-dom", () => ({
            useLocation: () => useLocationMock
        }));

        vi.mock("../auth/authContext", async () => {
            const mod = await vi.importActual('../auth/authContext');
            return {
                ...mod,
                useAuth: () => (loggedOutMock)
            }
        });

        render(<Navigation />);
        screen.debug();

        loggedOutNavigation.forEach(navItem => {
            const link = screen.getByText(navItem.name);
            expect(link).toBeInTheDocument();
        });

        loggedInNavigation.forEach(navItem => {
            if (navItem.name !== 'Home') {
                const link = screen.queryByText(navItem.name);
                expect(link).not.toBeInTheDocument();
            }
        });
    });


});




