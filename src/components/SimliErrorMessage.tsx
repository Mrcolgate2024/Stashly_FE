
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
  let formattedMessage = message;
  let actionLabel = "Reconnect";
  
  // Check for specific error patterns
  if (message.includes("unauthorized") || message.includes("401") || message.includes("Unauthorized")) {
    formattedMessage = "Session expired or unauthorized. Please reconnect.";
    actionLabel = "Reconnect";
  } else if (message.includes("TTS API Key") || message.includes("Invalid TTS")) {
    formattedMessage = "Text-to-speech service unavailable. Please try again later.";
    actionLabel = "Retry";
  } else if (message.includes("Duplicate DailyIframe")) {
    formattedMessage = "Avatar session already exists. Please refresh the page and try again.";
    actionLabel = "Reset";
  } else if (message.includes("API Error")) {
    formattedMessage = "API connection error. Please check your credentials and try again.";
    actionLabel = "Retry";
  } else if (!message) {
    formattedMessage = "Error connecting to avatar";
    actionLabel = "Retry";
  }

  return (
    <div className="absolute -top-24 right-0 bg-white p-3 rounded-md shadow-md text-sm max-w-[280px] border border-red-200">
      <p className="text-red-500 mb-2 font-medium">{formattedMessage}</p>
      <Button 
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded w-full"
        disabled={isProcessing}
      >
        {isProcessing ? "Connecting..." : actionLabel}
      </Button>
    </div>
  );
};
