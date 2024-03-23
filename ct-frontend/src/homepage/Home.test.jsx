import React from "react";
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../auth/authContext'; 

import Home from './Home';

vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
        ...mod,
        useLocation: () => ({
            location: {pathname: "/"}
        })
    }
})

describe('Home', () => {
    beforeEach(() => {
        const mockAuthContext = {
        currentUser: { username: 'testuser' } 
        };
        vi.spyOn(React, 'useContext').mockReturnValue(mockAuthContext);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
    
    it('renders the Home component', () => {
        render(
            <AuthContext.Provider value={{ currentUser: { username: 'testuser' } }}>
                <Home />
            </AuthContext.Provider>
        )
        screen.debug();
    });

    it('matches snapshot', () => {
        const homePage = render(
            <AuthContext.Provider value={{ currentUser: { username: 'testuser' } }}>
                <Home />
            </AuthContext.Provider>
        )
        screen.debug();
        expect(homePage).toMatchSnapshot();
    });

    it('matches snapshot when logged out', () => {
        const homePage = render(
            <AuthContext.Provider value={{ currentUser: null }}>
                <Home />
            </AuthContext.Provider>
        )
        screen.debug();
        expect(homePage).toMatchSnapshot();
    });
})