
import React from "react";

export const Logo = () => {
  return (
    <div className="fixed top-4 left-4 z-20">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/467f9419-307e-4a9a-91e5-4835bb67f62b.png" 
          alt="FinTech AI Logo" 
          className="h-16 w-16 object-contain"
        />
        <div className="text-white font-bold text-xl drop-shadow-md">
          FinTech AI
        </div>
      </div>
    </div>
  );
};
