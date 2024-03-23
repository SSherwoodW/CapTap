import React from "react";
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../auth/authContext';
import { useParams } from 'react-router-dom';

import Journal from "./Journal";

vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
        ...mod,
        useParams: () => ({
            username: "testUser"
        })
    }
})

describe("Journal", () => {
    it('renders the Journal component', () => {
        render(
            <Journal/>
        )
        screen.debug();
    });

    it('matches snapshot', () => {
        const journalPage = render(
            <Journal/>
        )
        expect(journalPage).toMatchSnapshot();
    });
})