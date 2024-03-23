import React from "react";
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../auth/authContext'; 

import Login from "./Login";

vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
        ...mod,
        useLocation: () => ({
            location: {pathname: "/"}
        }),
        Navigate: ({ to }) => <div data-testid="navigate">{to}</div>
    }
})

describe('Login', () => {
    beforeEach(() => {
        const mockAuthContext = {
        currentUser: { username: 'testuser' } 
        };
        vi.spyOn(React, 'useContext').mockReturnValue(mockAuthContext);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
    
    it('renders the Login component', () => {
        render(
            <AuthContext.Provider value={{ currentUser: { username: 'testuser' } }}>
                <Login />
            </AuthContext.Provider>
        )
        screen.debug();
    });

    it('matches snapshot', () => {
        const loginPage = render(
            <AuthContext.Provider value={{ currentUser: { username: 'testuser' } }}>
                <Login />
            </AuthContext.Provider>
        )
        screen.debug();
        expect(loginPage).toMatchSnapshot();
    });

    it('matches snapshot when logged out', () => {
        const loginPage = render(
            <AuthContext.Provider value={{ currentUser: null }}>
                <Login />
            </AuthContext.Provider>
        )
        screen.debug();
        expect(loginPage).toMatchSnapshot();
    });
})