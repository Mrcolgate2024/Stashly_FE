import React from "react";

export const WelcomeMessage = () => {
  return (
    <div className="text-center">
      <p className="mb-4 text-2xl font-semibold">
        Welcome to <span className="font-space-grotesk font-bold">$TASHLY</span>, your Financial Assistant!
      </p>
      <p className="text-lg text-gray-600 mb-2">Ask me anything about:</p>
      <ul className="list-disc pl-6 mx-auto space-y-2 inline-block text-left text-lg text-gray-600">
        <li>Investment strategies</li>
        <li>Market analysis</li>
        <li>Portfolio performance</li>
        <li>Financial planning</li>
      </ul>
    </div>
  );
};
