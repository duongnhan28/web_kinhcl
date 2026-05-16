'use client';

import { create } from 'zustand';
import { setApiToken } from '../lib/api';

interface AuthState {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
    setToken: (token) => {
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('accessToken', token);
                setApiToken(token);
            } else {
                localStorage.removeItem('accessToken');
                setApiToken(null);
            }
        }
        set({ token });
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            setApiToken(null);
        }
    }
}));
