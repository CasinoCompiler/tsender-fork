// Wrapper component for the entire application

"use client";

import {type ReactNode} from "react";
import {useState} from "react";

import { DarkModeProvider, useDarkMode } from "@/app/context/DarkModeContext";
import config from "@/rainbowKitConfig";
import { RainbowKitProvider, ConnectButton, lightTheme, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css"

function RainbowKitProviderWithTheme({ children }: { children: ReactNode }) {
    const { darkMode } = useDarkMode();

    return (
        <RainbowKitProvider
        theme={darkMode 
            ? darkTheme({
                accentColor: '#2563eb',
                borderRadius: 'medium',
              })
            : lightTheme({
                accentColor: '#2563eb',
                borderRadius: 'medium',
              })
        }
        >
            {children}
        </RainbowKitProvider>
    );
}

export function Providers(props: {children : ReactNode}) {
    const [queryClient] = useState(() => new QueryClient());
    return(
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <DarkModeProvider> 
                    <RainbowKitProviderWithTheme>
                        {props.children}
                    </RainbowKitProviderWithTheme>   
                </DarkModeProvider> 
            </QueryClientProvider>
        </WagmiProvider>
    )
}