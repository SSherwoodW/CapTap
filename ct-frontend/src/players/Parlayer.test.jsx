import React from "react";
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../auth/authContext'; 

import Parlayer from "./Parlayer";

vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
        ...mod,
        useLocation: () => ({
            location: {pathname: "/parlayer/PHX"}
        }),
        useParams: () => ({
            code: 'PHX'
        }),
        useNavigate: () => ({

        })
    }
})

describe('Parlayer', () => {
    beforeEach(() => {
        const mockAuthContext = {
        currentUser: { username: 'testuser' } 
        };
        vi.spyOn(React, 'useContext').mockReturnValue(mockAuthContext);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
    
    it('renders the Parlayer component', () => {
        render(
            <AuthContext.Provider value={{ currentUser: { username: 'testuser' } }}>
                <Parlayer />
            </AuthContext.Provider>
        )
    });

    it('matches snapshot', () => {
        const parlayer = render(
            <AuthContext.Provider value={{ currentUser: { username: 'testuser' } }}>
                <Parlayer />
            </AuthContext.Provider>
        )
        expect(parlayer).toMatchSnapshot();
    });

    it('matches snapshot when logged out', () => {
        const parlayer = render(
            <AuthContext.Provider value={{ currentUser: null }}>
                <Parlayer />
            </AuthContext.Provider>
        )
        expect(parlayer).toMatchSnapshot();
    });
})
