
import { useState, useEffect, useCallback } from "react";
import { initializeSimliScript, createSimliWidget } from "@/utils/simliUtils";

interface UseSimliAvatarProps {
  token: string;
  agentId: string;
  position: 'left' | 'right';
  eventName: string;
  customText?: string;
  customImage?: string;
  onMessageReceived: (message: string) => void;
}

export const useSimliAvatar = ({
  token,
  agentId,
  position,
  eventName,
  customText,
  customImage,
  onMessageReceived
}: UseSimliAvatarProps) => {
  const [isActivated, setIsActivated] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle error events from Simli
  useEffect(() => {
    const handleError = (event: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        const errorDetails = event.detail;
        console.error(`Simli error detected on ${eventName}:`, errorDetails);
        
        // Check if it's a token error
        let message = "Unknown error";
        let isTokenError = false;
        
        if (errorDetails.error) message = errorDetails.error;
        if (errorDetails.message) message = errorDetails.message;
        if (typeof errorDetails === 'string') message = errorDetails;
        
        // Check if it's a token-related error
        if (message.includes("token") || message.includes("401") || message.includes("auth")) {
          isTokenError = true;
          message = "Your session has expired. Please try again.";
        }
        
        setErrorMessage(message);
        setHasError(true);
        
        // If it's a token error, deactivate so user can retry
        if (isTokenError) {
          setIsActivated(false);
        }
      }
    };
    
    window.addEventListener('simli:error' as any, handleError as EventListener);
    // Also listen for specific avatar errors
    window.addEventListener(`${eventName}:error` as any, handleError as EventListener);
    
    return () => {
      window.removeEventListener('simli:error' as any, handleError as EventListener);
      window.removeEventListener(`${eventName}:error` as any, handleError as EventListener);
    };
  }, [eventName]);

  // Set up message listener when activated
  useEffect(() => {
    if (!isActivated) return;

    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener(eventName as any, handleSimliMessage as EventListener);

    return () => {
      window.removeEventListener(eventName as any, handleSimliMessage as EventListener);
    };
  }, [isActivated, eventName, onMessageReceived]);

  const initialize = useCallback(async () => {
    if (isActivated || isProcessing) return;
    
    setIsProcessing(true);
    setHasError(false);
    setErrorMessage("");
    
    try {
      console.log(`Initializing ${customText || "Simli"} avatar...`);
      
      // Load the Simli script if not already loaded
      await initializeSimliScript().catch(error => {
        console.error("Failed to load Simli script:", error);
        throw new Error("Failed to load Simli widget");
      });
      
      setIsActivated(true);
      console.log(`Using provided token for ${customText || "Simli"} avatar`);
      
      // A short delay to ensure DOM is ready
      setTimeout(() => setIsProcessing(false), 500);
    } catch (error) {
      console.error("Error in initialization:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to connect to avatar service");
      setHasError(true);
      setIsActivated(false);
      setIsProcessing(false);
    }
  }, [isActivated, isProcessing, customText, token]);

  const retryInitialization = useCallback(() => {
    setIsActivated(false);
    setTimeout(initialize, 100);
  }, [initialize]);

  return {
    isActivated,
    hasError,
    errorMessage,
    isProcessing,
    initialize,
    retryInitialization
  };
};
