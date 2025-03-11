
import React from "react";

export const WelcomeMessage = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center opacity-70">
        <p className="mb-4 text-xl font-semibold">
          Welcome to <span className="font-space-grotesk font-bold">$tashly</span>, your Financial Assistant!
        </p>
        <p className="mb-2">Ask me anything about:</p>
        <ul className="list-disc pl-6 mx-auto space-y-2 inline-block text-left">
          <li>Investment strategies</li>
          <li>Market analysis</li>
          <li>Portfolio performance</li>
          <li>Financial planning</li>
        </ul>
      </div>
    </div>
  );
};
