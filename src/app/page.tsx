"use client";

import HomeContent from "@/components/HomeContent";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

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