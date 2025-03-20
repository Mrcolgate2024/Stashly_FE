import React from "react";

export const Logo = () => {
  return (
    <div className="absolute right-[-75px] top-16 flex flex-col items-center z-40">
      <div className="rounded-full bg-[#1e2a38] p-1 shadow-md border-2 border-[#d4af37]">
        <img 
          src="/lovable-uploads/467f9419-307e-4a9a-91e5-4835bb67f62b.png" 
          alt="$tashly Logo" 
          className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-full"
        />
      </div>
      <div className="mt-0 flex flex-col items-center">
        <div className="font-space-grotesk text-[#1e2a38] font-extrabold text-4xl sm:text-5xl tracking-wider drop-shadow-md rotate-[-90deg] origin-center translate-y-24">
          <span className="text-[#1e2a38] font-black">$</span>TASHLY
        </div>
      </div>
    </div>
  );
};
