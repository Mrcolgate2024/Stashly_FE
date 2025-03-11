
import React from "react";

export const Logo = () => {
  return (
    <div className="py-2">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/467f9419-307e-4a9a-91e5-4835bb67f62b.png" 
          alt="$tashly Logo" 
          className="h-10 w-10 sm:h-16 sm:w-16 object-contain"
        />
        <div className="font-space-grotesk text-white font-extrabold text-3xl sm:text-5xl uppercase tracking-wider drop-shadow-md">
          <span className="text-white font-black">$</span>tashly
        </div>
      </div>
    </div>
  );
};
