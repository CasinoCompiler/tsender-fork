import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "TSender-fork"
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Inline script that runs BEFORE React to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check localStorage first
                  var savedMode = localStorage.getItem('darkMode');
                  var isDark = false;
                  
                  if (savedMode !== null) {
                    isDark = savedMode === 'dark';
                  } else {
                    // Fallback to system preference
                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }
                  
                  // Apply theme immediately
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Silent fail if localStorage is not available
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <Header githubUrl="https://github.com/CasinoCompiler" />
          {props.children}
        </Providers>
      </body>
    </html>
  );
}