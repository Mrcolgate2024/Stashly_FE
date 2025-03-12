
import React, { useState, useEffect } from "react";
import { AvatarButton } from "./AvatarButton";
import { SimliErrorMessage } from "./SimliErrorMessage";
import { toast } from "@/hooks/use-toast";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  agentId: string;
  customText?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  agentId,
  customText = "Financial Analyst",
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";
  
  // Updated token for Financial Analyst
  const FINANCIAL_ANALYST_TOKEN = "gAAAAABn0cx5UMO6tFazmf8b6fpNdhqhNk5KGev-hDLsIB9HePud-3A6IJKqDgzTf-R0JQzdvwefDKGZYCLzTQQdS_dC8HC5alJSZ8_CEy5ym7QXJDbJQmEgGnA7emeCWPDNDpx1cw05uao4ybvW4kMAmquGi6NM3Yyj4sbZJa6rE-SbeFiV50Uo1rzTvb89A8_cr_3SKmUXExXRrYjNVUQobYsvavul10FdL8RT9gPrlVBF0jOKqGHWb-52uPtr7k5RB-dRo1qBWh0TV7rLxX56bckGdiyNREEZAon2alU8oYGRfU0FK-21QPSGPsj_zgbyaJhTaSu0m3mB9c_h7XdBmo2L5l2e1aLUltYMsMy6VqDXUrzJvTgNb_pZqWdGoMwIN1l0HwVlD_8enFeCWwHZfIwhZpq-tk9r9EpzIP9JCk0dn3gNMifpGJ7GvVHGdHkLv1-3plDn6CcvLNNvmMrrUPmSbFNpXNSyElbggRlwu1wi4UHpVoYcnyRCPLintdUlabz5h-5c";

  // Set up event listener for Simli messages
  useEffect(() => {
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        console.log(`Received message from ${customText}:`, event.detail.message);
        onMessageReceived(event.detail.message);
      }
    };

    // Listen for errors from Simli
    const handleSimliError = (event: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        console.error("Simli error:", event.detail);
        let message = "Error connecting to avatar";
        
        if (typeof event.detail === 'object') {
          if (event.detail.error) message = event.detail.error;
          if (event.detail.message) message = event.detail.message;
          if (event.detail.detail) message = event.detail.detail;
        } else if (typeof event.detail === 'string') {
          message = event.detail;
        }
        
        setHasError(true);
        setErrorMessage(message);
        
        // Show a toast notification for critical errors
        if (message.includes("401") || 
            message.includes("unauthorized") || 
            message.includes("Unauthorized") ||
            message.includes("Invalid")) {
          toast({
            title: "Avatar Connection Error",
            description: `${customText} avatar authorization failed. Token may be expired.`,
            variant: "destructive",
          });
          
          // Auto-deactivate on auth errors to allow retry
          setIsActivated(false);
          window.simliAvatarActive = false;
        }
      }
    };

    // Add custom event listeners
    window.addEventListener('simli:financial:message' as any, handleSimliMessage as EventListener);
    window.addEventListener('simli:error' as any, handleSimliError as EventListener);
    
    return () => {
      window.removeEventListener('simli:financial:message' as any, handleSimliMessage as EventListener);
      window.removeEventListener('simli:error' as any, handleSimliError as EventListener);
    };
  }, [customText, onMessageReceived]);

  const initialize = () => {
    if (isActivated || isProcessing) return;
    
    // Check if another avatar is already active
    if (window.simliAvatarActive) {
      setHasError(true);
      setErrorMessage("Please deactivate the other avatar first");
      return;
    }
    
    setIsProcessing(true);
    setHasError(false);
    setErrorMessage("");
    
    try {
      console.log(`Initializing ${customText} avatar...`);
      console.log(`Using token for ${customText} avatar`);
      setIsActivated(true);
      window.simliAvatarActive = true;
      
      // A short delay to ensure DOM is ready
      setTimeout(() => {
        console.log(`${customText} avatar widget added to DOM`);
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      console.error("Error in initialization:", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Failed to connect to avatar service");
      setIsProcessing(false);
      window.simliAvatarActive = false;
      
      toast({
        title: "Avatar Initialization Error",
        description: `Failed to initialize ${customText} avatar. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const retryInitialization = () => {
    setIsActivated(false);
    window.simliAvatarActive = false;
    setTimeout(initialize, 100);
    
    toast({
      title: "Reconnecting",
      description: `Attempting to reconnect ${customText} avatar...`,
    });
  };

  useEffect(() => {
    // When deactivated, update the global state
    if (!isActivated) {
      window.simliAvatarActive = false;
    }
  }, [isActivated]);

  // Listen for global Simli errors regardless of avatar type
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message && (
        event.message.includes('DailyIframe') || 
        event.message.includes('daily-js') ||
        event.message.includes('duplicate') ||
        event.message.includes('Unauthorized') ||
        event.message.includes('401')
      )) {
        console.warn(`Caught Simli error in ${customText}:`, event.message);
        
        if (isActivated) {
          setHasError(true);
          setErrorMessage(event.message);
          
          // Only show toast when avatar is active to avoid duplicate notifications
          toast({
            title: "Avatar Connection Issue",
            description: `${customText} encountered an error: ${event.message.slice(0, 50)}...`,
            variant: "destructive",
          });
        }
      }
    };
    
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [customText, isActivated]);

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10">
      {!isActivated ? (
        <AvatarButton
          onClick={initialize}
          isProcessing={isProcessing}
          bgColor="bg-blue-500"
          hoverColor="hover:bg-blue-600"
          imageUrl={customImageUrl}
          altText={customText}
        />
      ) : (
        <div className="relative">
          {hasError && (
            <SimliErrorMessage 
              message={errorMessage}
              onRetry={retryInitialization}
              isProcessing={isProcessing}
            />
          )}
          <div className="min-h-[60px] min-w-[60px]">
            {/* Update the attributes to include $ prefix if needed by the API */}
            <div id="financial-analyst-container">
              <simli-widget 
                token={`$${FINANCIAL_ANALYST_TOKEN}`}
                agentid={`$${agentId}`}
                position="right"
                eventname="simli:financial:message"
                customtext={customText}
                customimage={customImageUrl}
              ></simli-widget>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
