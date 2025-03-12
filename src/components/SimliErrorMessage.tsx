
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
  // Don't show error message for TTS API Key issues
  if (message.includes("TTS API Key")) {
    return null;
  }
  
  return (
    <div className="absolute -top-16 right-0 bg-white p-2 rounded-md shadow-md text-sm max-w-[200px]">
      <p className="text-red-500 mb-1">{message || "Error connecting to avatar"}</p>
      <Button 
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded w-full"
        disabled={isProcessing}
      >
        Retry connection
      </Button>
    </div>
  );
};
