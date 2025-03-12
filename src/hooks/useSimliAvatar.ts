
import { useState, useEffect, useCallback, useRef } from "react";
import { initializeSimliScript, createSimliWidget, safelyRemoveWidget, setupVisibilityChangeProtection } from "@/utils/simliUtils";

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
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const [scriptInitialized, setScriptInitialized] = useState(false);
  
  // Set up protection against visibility change errors once
  useEffect(() => {
    setupVisibilityChangeProtection();
  }, []);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetContainerRef.current) {
        safelyRemoveWidget({ current: widgetContainerRef.current });
      }
    };
  }, []);

  // Handle error events from Simli
  useEffect(() => {
    const handleError = (event: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        const errorDetails = event.detail;
        console.log(`Simli ${eventName} error detected:`, errorDetails);
        
        // Extract error message
        let message = "Unknown error";
        let isAuthError = false;
        
        if (errorDetails.error) message = errorDetails.error;
        if (errorDetails.message) message = errorDetails.message;
        if (typeof errorDetails === 'string') message = errorDetails;
        if (errorDetails.detail) message = errorDetails.detail;
        
        // Check if it's a token-related error
        if (
          message.includes("token") || 
          message.includes("401") || 
          message.includes("auth") || 
          message.includes("unauthorized") ||
          message.toLowerCase().includes("permission")
        ) {
          isAuthError = true;
          message = "unauthorized";
          console.error(`Authentication error for ${customText} avatar:`, message);
        }
        
        setErrorMessage(message);
        setHasError(true);
        
        // If it's an auth error, deactivate so user can retry
        if (isAuthError) {
          setIsActivated(false);
          safelyRemoveWidget({ current: widgetContainerRef.current });
        }
      }
    };
    
    // Listen for both global and specific avatar errors
    window.addEventListener('simli:error' as any, handleError as EventListener);
    window.addEventListener(`${eventName}:error` as any, handleError as EventListener);
    
    return () => {
      window.removeEventListener('simli:error' as any, handleError as EventListener);
      window.removeEventListener(`${eventName}:error` as any, handleError as EventListener);
    };
  }, [eventName, customText]);

  // Set up message listener when activated
  useEffect(() => {
    if (!isActivated) return;

    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        console.log(`Received message from ${customText}:`, event.detail.message);
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener(eventName as any, handleSimliMessage as EventListener);

    return () => {
      window.removeEventListener(eventName as any, handleSimliMessage as EventListener);
    };
  }, [isActivated, eventName, onMessageReceived, customText]);

  // Initialize the script once for all widgets
  useEffect(() => {
    if (!scriptInitialized) {
      console.log("Initializing Simli script...");
      initializeSimliScript()
        .then(() => {
          setScriptInitialized(true);
          console.log("Simli script initialized successfully");
        })
        .catch(error => {
          console.error("Failed to initialize Simli script:", error);
          setErrorMessage("Failed to load avatar service");
          setHasError(true);
        });
    }
  }, [scriptInitialized]);

  // Update reference to widget container
  const updateContainerRef = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    widgetContainerRef.current = ref.current;
  }, []);

  const initialize = useCallback(async () => {
    if (isActivated || isProcessing) return;
    
    setIsProcessing(true);
    setHasError(false);
    setErrorMessage("");
    
    try {
      console.log(`Initializing ${customText || "Simli"} avatar...`);
      
      // Wait until script is loaded
      if (!scriptInitialized) {
        await initializeSimliScript().catch(error => {
          console.error("Failed to load Simli script:", error);
          throw new Error("Failed to load avatar widget");
        });
        setScriptInitialized(true);
      }
      
      // Log token for debugging (masked)
      if (token) {
        const maskedToken = token.length > 20 
          ? `${token.substring(0, 10)}...${token.substring(token.length - 5)}`
          : "[TOKEN ERROR]";
        console.log(`Using token for ${customText}: ${maskedToken}`);
      } else {
        console.error(`No token provided for ${customText}`);
        throw new Error("No token provided");
      }
      
      setIsActivated(true);
      
      // A short delay to ensure DOM is ready
      setTimeout(() => setIsProcessing(false), 500);
    } catch (error) {
      console.error("Error in initialization:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to connect to avatar service");
      setHasError(true);
      setIsActivated(false);
      setIsProcessing(false);
    }
  }, [isActivated, isProcessing, customText, scriptInitialized, token]);

  const retryInitialization = useCallback(() => {
    console.log(`Retrying initialization for ${customText}...`);
    if (widgetContainerRef.current) {
      safelyRemoveWidget({ current: widgetContainerRef.current });
    }
    setIsActivated(false);
    setTimeout(initialize, 100);
  }, [initialize, customText]);

  return {
    isActivated,
    hasError,
    errorMessage,
    isProcessing,
    initialize,
    retryInitialization,
    updateContainerRef
  };
};
