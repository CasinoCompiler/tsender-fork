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
        {/* BLOCKING script - executes immediately, before parser continues */}
        <script
          // Using dangerouslySetInnerHTML ensures this is injected as early as possible
          dangerouslySetInnerHTML={{
            __html: `
              // Execute immediately, blocking everything else
              (function() {
                'use strict';
                
                function applyTheme() {
                  var html = document.documentElement;
                  var body = document.body;
                  
                  try {
                    var savedMode = localStorage.getItem('darkMode');
                    var isDark = false;
                    
                    if (savedMode !== null) {
                      isDark = savedMode === 'dark';
                    } else {
                      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    }
                    
                    if (isDark) {
                      html.classList.add('dark');
                      html.style.backgroundColor = '#0f0f0f';
                      html.style.color = '#ededed';
                      html.style.colorScheme = 'dark';
                      if (body) {
                        body.style.backgroundColor = '#0f0f0f';
                        body.style.color = '#ededed';
                      }
                    } else {
                      html.classList.remove('dark');
                      html.style.backgroundColor = '#ffffff';
                      html.style.color = '#171717';
                      html.style.colorScheme = 'light';
                      if (body) {
                        body.style.backgroundColor = '#ffffff';
                        body.style.color = '#171717';
                      }
                    }
                  } catch (e) {
                    // Fallback to light mode on any error
                    html.classList.remove('dark');
                    html.style.backgroundColor = '#ffffff';
                    html.style.color = '#171717';
                    html.style.colorScheme = 'light';
                  }
                }
                
                // Apply immediately
                applyTheme();
                
                // Also apply when DOM is ready (in case body wasn't available)
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', applyTheme);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <Header githubUrl="https://github.com/CasinoCompiler/tsender-fork" />
          {props.children}
        </Providers>
      </body>
    </html>
  );
}