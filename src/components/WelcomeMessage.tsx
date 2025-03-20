
import React from "react";

export const WelcomeMessage = () => {
  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <picture className="relative">
          <source srcSet="/images/Stashlylogotype.webp" type="image/webp" />
          <img 
            src="/images/Stashlylogotype.png" 
            alt="$tashly Logo" 
            className="h-24 w-24 object-contain rounded-full bg-[#1e2a38] p-1 border-2 border-[#d4af37]"
          />
        </picture>
      </div>
      <p className="mb-4 text-2xl font-semibold">
        Welcome to your Financial Assistant!
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
