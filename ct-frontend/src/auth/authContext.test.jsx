import React, { createContext, useContext, useState, useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import useLocalStorage from '../hooks/useLocalStorage';
import CapTapApi from '../../../api';
import * as jose from 'jose';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {useAuth, AuthContext} from "./authContext";
import Home from '../homepage/Home'

vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
        ...mod,
        useLocation: () => ({
            location: {pathname: "/"}
        })
    }
})

describe('authContext', () => {
    beforeEach(() => {
        const mockAuthContext = {
        currentUser: { username: 'testuser' } 
        };
        vi.spyOn(React, 'useContext').mockReturnValue(mockAuthContext);
    })

    afterEach(() => {
        vi.restoreAllMocks();
    })

    it("renders the AuthProvider Component", () => {
        render(
            <AuthContext.Provider value={{ currentUser: { username: null } }}>
                <Home />
            </AuthContext.Provider>
        );

        expect(useAuth().isLoggedIn).toBe(false);
        expect(useAuth().currentUser).toBe(null);
    })
})