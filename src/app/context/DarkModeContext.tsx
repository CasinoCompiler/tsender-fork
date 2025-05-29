import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type DarkModeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType>({
    darkMode: false,
    toggleDarkMode: () => { },
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    // Initialize by reading what the inline script already set
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        // During SSR, return false to match server
        if (typeof window === 'undefined') return false;

        // On client, read the current state that the inline script set
        return document.documentElement.classList.contains('dark');
    });

    // Sync with document class and localStorage when toggled
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Apply theme to document
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save to localStorage
        try {
            localStorage.setItem('darkMode', darkMode ? 'dark' : 'light');
        } catch (error) {
            console.warn('Unable to save to localStorage:', error);
        }
    }, [darkMode]);

    // Listen for system preference changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = (e: MediaQueryListEvent) => {
            // Only update if user hasn't set a manual preference
            const savedMode = localStorage.getItem('darkMode');
            if (!savedMode) {
                setDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleSystemChange);
        return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

// Custom hook to use dark mode
export const useDarkMode = () => useContext(DarkModeContext);