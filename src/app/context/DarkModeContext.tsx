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
    const [darkMode, setDarkMode] = useState<boolean>(false);

    // Initialize dark mode from localStorage or user preference
    useEffect(() => {
        // Check localStorage first
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setDarkMode(savedMode === 'dark');
        } else {
            // Check user's system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        }
    }, []);

    // Apply dark mode to the document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save preference to localStorage
        localStorage.setItem('darkMode', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

// Custom hook to use dark mode
export const useDarkMode = () => useContext(DarkModeContext);