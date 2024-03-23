import React from "react";
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../auth/authContext'; 

import Signup from "./Signup";

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

describe('Signup', () => {
    beforeEach(() => {
        const mockAuthContext = {
        currentUser: { username: 'testuser' } 
        };
        vi.spyOn(React, 'useContext').mockReturnValue(mockAuthContext);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
    
    it('renders the Signup component', () => {
        render(
            <AuthContext.Provider value={{ currentUser: { username: 'testuser' } }}>
                <Signup />
            </AuthContext.Provider>
        )
        screen.debug();
    });

    it('matches snapshot', () => {
        const signupPage = render(
            <AuthContext.Provider value={{ currentUser: { username: 'testuser' } }}>
                <Signup />
            </AuthContext.Provider>
        )
        screen.debug();
        expect(signupPage).toMatchSnapshot();
    });

    it('matches snapshot when logged out', () => {
        const signupPage = render(
            <AuthContext.Provider value={{ currentUser: null }}>
                <Signup />
            </AuthContext.Provider>
        )
        screen.debug();
        expect(signupPage).toMatchSnapshot();
    });
})