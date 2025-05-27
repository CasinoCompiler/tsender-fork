"use client"

import React from "react";
import AirdropForm from "./AirdropForm";

function HomeContent(): React.ReactElement {
  return (
    <div className="flex justify-center w-full py-8 px-4">
      <div className="w-full max-w-4xl border border-blue-500 ring-[4px] border-2 ring-blue-500/25 rounded-2xl bg-white-900 p-8">
        <h2 className="text-2xl font-bold mb-6">T-Sender</h2>
        <AirdropForm />
      </div>
    </div>
  );
}

export default HomeContent;