import React from "react";

export const WelcomeMessage = () => {
  return (
    <div className="text-center w-full max-w-3xl mx-auto px-4">
      <div className="sm:hidden mb-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-[#1e2a38] p-1 shadow-md border-2 border-[#d4af37]">
            <picture>
              <source srcSet="/images/Stashlylogotype.webp" type="image/webp" />
              <img 
                src="/images/Stashlylogotype.png" 
                alt="$tashly Logo" 
                className="h-20 w-20 object-contain rounded-full"
              />
            </picture>
          </div>
        </div>
      </div>
      <p className="mb-4 text-2xl sm:text-3xl font-semibold">
        Welcome to <span className="font-space-grotesk font-bold">$TASHLY</span>, your Financial Assistant!
      </p>
      <p className="text-lg sm:text-xl text-gray-600 mb-4">Ask me anything about:</p>
      <ul className="list-disc inline-block text-left text-lg sm:text-xl text-gray-600 space-y-3">
        <li>Investment strategies</li>
        <li>Market analysis</li>
        <li>Portfolio performance</li>
        <li>Financial planning</li>
      </ul>
    </div>
  );
};
