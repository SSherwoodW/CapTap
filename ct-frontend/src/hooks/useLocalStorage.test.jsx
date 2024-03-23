import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useState } from 'react';
import useLocalStorage from './useLocalStorage';


let mockLocalStorage = {};
global.localStorage = {
  getItem: (key) => mockLocalStorage[key],
  setItem: (key, value) => {
    mockLocalStorage[key] = value;
  },
  removeItem: (key) => {
    delete mockLocalStorage[key];
  },
};


describe('useLocalStorage', () => {
    beforeEach(() => {
        mockLocalStorage = {};
    });

    it('sets and gets value from localStorage', () => {
        const { result } = renderHook(() => useLocalStorage("testKey", "defaultValue"));
        const { value } = result.current;
        expect(localStorage.getItem("testKey")).toBe(JSON.stringify('defaultValue'));
    });

    it('updates stored value', () => {
        const { result } = renderHook(() => useLocalStorage("testKey", "defaultValue"));
        expect(localStorage.getItem("testKey")).toBe(JSON.stringify('defaultValue'));
        localStorage.setItem('testKey', 'newValue');
        expect(localStorage.getItem("testKey")).toBe('newValue');
    });
});
