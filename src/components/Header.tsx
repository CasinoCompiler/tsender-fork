"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDarkMode } from "@/app/context/DarkModeContext";

interface HeaderProps {
    githubUrl: string;
    title?: string;
}

const Header: React.FC<HeaderProps> = ({
    githubUrl,
    title = "TSender"
}) => {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <header className="flex items-center justify-between px-8 py-4 w-full border-b transition-colors duration-200 border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--foreground)]">
            <div className="flex items-center gap-4">
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-gray-400 transition-colors"
                >
                    <FaGithub size={24} />
                </a>
                <h1 className="text-2xl font-bold">
                    {title}
                </h1>
            </div>
            <div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {/* Use CSS-based icon display to prevent flash */}
                        <span className="dark:hidden">
                            <FaMoon size={20} />
                        </span>
                        <span className="hidden dark:inline">
                            <FaSun size={20} />
                        </span>
                    </button>
                    <ConnectButton />
                </div>
            </div>
        </header>
    );
};

export default Header;