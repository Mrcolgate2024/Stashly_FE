
import React from "react";
import { Button } from "./ui/button";

interface AvatarButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  bgColor: string;
  hoverColor: string;
  initials?: string;
  imageUrl?: string;
  altText?: string;
}

export const AvatarButton: React.FC<AvatarButtonProps> = ({
  onClick,
  isProcessing,
  bgColor,
  hoverColor,
  initials,
  imageUrl,
  altText
}) => {
  return (
    <Button 
      onClick={onClick}
      className={`${bgColor} text-white rounded-full p-3 shadow-lg ${hoverColor} transition-colors`}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <div className="w-12 h-12 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="w-12 h-12 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={altText || "Avatar"} 
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
              }}
            />
          ) : (
            <span className="text-xl font-bold">{initials}</span>
          )}
        </div>
      )}
    </Button>
  );
};
