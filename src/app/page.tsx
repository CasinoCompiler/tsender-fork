"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import HomeContent from "@/components/HomeContent";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export default function Home() {
  const { isConnected } = useAccount();
  const [isHydrated, setIsHydrated] = useState(false);

  // Track hydration to prevent SSR/client mismatches
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Show consistent content until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-center">
          <h2 className="text-xl text-zinc-600">
            Please Connect a Wallet
          </h2>
        </div>
      </div>
    );
  }

  // After hydration, show dynamic content based on connection state
  return (
    <div className="min-h-screen flex flex-col">
      {isConnected ? (
        <div>
          <HomeContent />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <h2 className="text-xl text-zinc-600">
            Please Connect a Wallet
          </h2>
        </div>
      )}
    </div>
  );
}