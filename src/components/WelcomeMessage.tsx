
import React from "react";

export const WelcomeMessage = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center opacity-70">
        <p className="mb-4 text-xl font-semibold">Welcome to the Financial Assistant</p>
        <p className="mb-2">Ask me anything about:</p>
        <ul className="list-disc text-left max-w-md mx-auto space-y-2">
          <li>Investment strategies</li>
          <li>Market analysis</li>
          <li>Portfolio performance</li>
          <li>Financial planning</li>
        </ul>
      </div>
    </div>
  );
};
