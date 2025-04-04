import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface WelcomeMessageProps {
  onRefresh?: () => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onRefresh }) => {
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
      <div className="flex justify-center items-center gap-2 mb-4">
        <p className="text-2xl sm:text-3xl font-semibold">
          Welcome to <span className="font-space-grotesk font-bold">$TASHLY</span>, your financial assistant!
        </p>
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="hover:bg-gray-200/50"
            title="Refresh chat"
          >
            <RefreshCcw className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="text-center">
        <p className="text-lg sm:text-xl text-gray-700 mb-4">Ask me anything about:</p>
        <div className="inline-block text-lg sm:text-xl text-gray-700 space-y-3">
          <p className="italic">Investment strategies</p>
          <p className="italic">Market insights and news</p>
          <p className="italic">Portfolio performance and risk</p>
          <p className="italic">Financial planning and fund analysis</p>
        </div>
        <p className="mt-4 text-lg sm:text-xl text-gray-700">
          I'm here to help you make smarter financial decisions — just start typing!
        </p>
      </div>
    </div>
  );
};
