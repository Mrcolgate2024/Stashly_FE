
import React from "react";
import { Button } from "./ui/button";

interface SimliErrorMessageProps {
  message: string;
  onRetry: () => void;
  isProcessing: boolean;
}

export const SimliErrorMessage: React.FC<SimliErrorMessageProps> = ({
  message,
  onRetry,
  isProcessing
}) => {
  // Format the error message to be more user-friendly
  const formattedMessage = message.includes("unauthorized") || message.includes("401") 
    ? "Session expired. Please reconnect the avatar."
    : message || "Error connecting to avatar";

  return (
    <div className="absolute -top-16 right-0 bg-white p-2 rounded-md shadow-md text-sm max-w-[250px]">
      <p className="text-red-500 mb-1">{formattedMessage}</p>
      <Button 
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded w-full"
        disabled={isProcessing}
      >
        Reconnect
      </Button>
    </div>
  );
};
