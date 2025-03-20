import React from "react";

export const Logo = () => {
  return (
    <div className="absolute right-[-75px] top-16 hidden sm:flex flex-col items-center z-40">
      <div className="rounded-full bg-[#1e2a38] p-1 shadow-md border-2 border-[#d4af37]">
        <picture>
          <source srcSet="/images/Stashlylogotype.webp" type="image/webp" />
          <img 
            src="/images/Stashlylogotype.png" 
            alt="$tashly Logo" 
            className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-full"
          />
        </picture>
      </div>
      <div className="mt-0 flex flex-col items-center">
        <div className="font-space-grotesk text-[#1e2a38] font-extrabold text-4xl sm:text-5xl tracking-wider drop-shadow-md rotate-[-90deg] origin-center translate-y-24">
          <span className="text-[#1e2a38] font-black">$</span>TASHLY
        </div>
      </div>
    </div>
  );
};
