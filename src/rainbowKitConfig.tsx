"use client";

import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import { mainnet, optimism, arbitrum, base, zksync, sepolia, anvil } from "wagmi/chains";

export default getDefaultConfig ({
    appName: "TSender-fork",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_KEY!,
    chains: [mainnet, optimism, arbitrum, base, zksync, sepolia, anvil],
    ssr: false
});