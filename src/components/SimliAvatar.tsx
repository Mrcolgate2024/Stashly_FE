
import React, { useState, useEffect } from "react";
import { AvatarButton } from "./AvatarButton";
import { SimliErrorMessage } from "./SimliErrorMessage";

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
  
  // Hard-coded valid token with unique name for Financial Analyst - but this one may need updating
  const FINANCIAL_ANALYST_TOKEN = "gAAAAABn0WgrjDfB13EKqTvpj6ZEZvNhO9E7mLXtZM7Y2RRFmZAgOkcERx38gkK8TCoAA0B8pXFH2MUCghd18QA0aMxreVeKdbIiGKzTpY0L_zSke0CVqw1VFttwGf0SsN2KDJJVTcStqGcqRYqMjorHlzn3Nf7UWc_BTJQKyVzNluSH0xSzCV7mqnNyEFxQtBwYuZNhWt-GIQTCelp3bvyfxns4OaZ4aJ96hDxV_0XsOF3XLVXKNoXikMCGYl9FvnXG5t68WoCYnJUoBMCVW8WKfeOcpbF8dPk4vW0kPFVGv9W1WSnyh--s3dtSe2YRQth3CRntHujSc9w2SI-oexNMYNSsA7zaDYX0nMccHYBrt2grvhbZmVVMhB4wyoaPIp-EopN1umJmPt-CYfzZGmxoThRRLkZAMPQCbHxrvTCxAUaedjxvENty8qlJdvahdzTN9NIBAOSI8gmGmMV96UCDDiT9L6Q7E7R-ZkyDm8YCaYntvve5DKQ_2cieYqEkhhnXrRia6AMj";

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
        
        // Auto-deactivate on auth/TTS errors to allow retry
        if (message.includes("401") || 
            message.includes("unauthorized") || 
            message.includes("TTS API Key") ||
            message.includes("Duplicate DailyIframe")) {
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
      console.log(`Using provided token for ${customText} avatar`);
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
    }
  };

  const retryInitialization = () => {
    setIsActivated(false);
    window.simliAvatarActive = false;
    setTimeout(initialize, 100);
  };

  useEffect(() => {
    // When deactivated, update the global state
    if (!isActivated) {
      window.simliAvatarActive = false;
    }
  }, [isActivated]);

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
            {/* Using simli-widget as a custom element */}
            <div id="financial-analyst-container">
              <simli-widget 
                token={FINANCIAL_ANALYST_TOKEN}
                agentid={agentId}
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
