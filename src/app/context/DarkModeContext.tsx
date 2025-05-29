import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type DarkModeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
    isHydrated: boolean;
};

const DarkModeContext = createContext<DarkModeContextType>({
    darkMode: false,
    toggleDarkMode: () => { },
    isHydrated: false,
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    // Always start with false to match server render
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Handle hydration and initial setup
    useEffect(() => {
        // Mark as hydrated first
        setIsHydrated(true);

        // Get the correct dark mode value after hydration
        const getInitialDarkMode = (): boolean => {
            try {
                // Check localStorage first
                const savedMode = localStorage.getItem('darkMode');
                if (savedMode !== null) {
                    return savedMode === 'dark';
                }

                // Fallback to system preference
                return window.matchMedia('(prefers-color-scheme: dark)').matches;
            } catch (error) {
                console.warn('Unable to access localStorage:', error);
                return false;
            }
        };

        const initialMode = getInitialDarkMode();
        setDarkMode(initialMode);

        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = (e: MediaQueryListEvent) => {
            // Only update if user hasn't set a preference in localStorage
            const savedMode = localStorage.getItem('darkMode');
            if (!savedMode) {
                setDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleSystemChange);
        return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }, []);

    // Apply dark mode to document and save to localStorage
    useEffect(() => {
        // Only apply after hydration to avoid mismatches
        if (!isHydrated) return;

        // Apply dark mode class
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save preference to localStorage
        try {
            localStorage.setItem('darkMode', darkMode ? 'dark' : 'light');
        } catch (error) {
            console.warn('Unable to save to localStorage:', error);
        }
    }, [darkMode, isHydrated]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, isHydrated }}>
            {children}
        </DarkModeContext.Provider>
    );
};

// Custom hook to use dark mode
export const useDarkMode = () => useContext(DarkModeContext);