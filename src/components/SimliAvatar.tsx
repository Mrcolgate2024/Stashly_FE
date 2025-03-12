import React, { useState, useEffect } from "react";
import { AvatarButton } from "./AvatarButton";
import { SimliErrorMessage } from "./SimliErrorMessage";
import { toast } from "@/hooks/use-toast";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  onError?: (error: string) => void;
  agentId: string;
  customText?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  onError,
  agentId,
  customText = "Financial Analyst",
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";
  
  const FINANCIAL_ANALYST_TOKEN = "gAAAAABn0cx5UMO6tFazmf8b6fpNdhqhNk5KGev-hDLsIB9HePud-3A6IJKqDgzTf-R0JQzdvwefDKGZYCLzTQQdS_dC8HC5alJSZ8_CEy5ym7QXJDbJQmEgGnA7emeCWPDNDpx1cw05uao4ybvW4kMAmquGi6NM3Yyj4sbZJa6rE-SbeFiV50Uo1rzTvb89A8_cr_3SKmUXExXRrYjNVUQobYsvavul10FdL8RT9gPrlVBF0jOKqGHWb-52uPtr7k5RB-dRo1qBWh0TV7rLxX56bckGdiyNREEZAon2alU8oYGRfU0FK-21QPSGPsj_zgbyaJhTaSu0m3mB9c_h7XdBmo2L5l2e1aLUltYMsMy6VqDXUrzJvTgNb_pZqWdGoMwIN1l0HwVlD_8enFeCWwHZfIwhZpq-tk9r9EpzIP9JCk0dn3gNMifpGJ7GvVHGdHkLv1-3plDn6CcvLNNvmMrrUPmSbFNpXNSyElbggRlwu1wi4UHpVoYcnyRCPLintdUlabz5h-5c";

  useEffect(() => {
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        console.log(`Received message from ${customText}:`, event.detail.message);
        onMessageReceived(event.detail.message);
      }
    };

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
        
        if (onError) {
          onError(message);
        }
        
        if (message.includes("TTS API Key") || message.includes("Invalid TTS")) {
          toast({
            title: "Text-to-Speech Unavailable",
            description: "The avatar will continue to function with text-only responses.",
            variant: "warning",
          });
          
          return;
        }
        
        if (message.includes("401") || 
            message.includes("unauthorized") || 
            message.includes("Unauthorized")) {
          toast({
            title: "Avatar Connection Error",
            description: `${customText} avatar authorization failed. Token may be expired.`,
            variant: "destructive",
          });
          
          setIsActivated(false);
          window.simliAvatarActive = false;
        }
      }
    };

    window.addEventListener('simli:financial:message' as any, handleSimliMessage as EventListener);
    window.addEventListener('simli:error' as any, handleSimliError as EventListener);
    
    return () => {
      window.removeEventListener('simli:financial:message' as any, handleSimliMessage as EventListener);
      window.removeEventListener('simli:error' as any, handleSimliError as EventListener);
    };
  }, [customText, onMessageReceived, onError]);

  useEffect(() => {
    if (!isActivated) return;
    
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message && (
        event.message.includes('API Error')
      )) {
        console.warn(`Caught API error in ${customText}:`, event.message);
        
        if (onError) {
          onError(event.message);
        }
        
        if (event.message.includes('TTS API Key') || event.message.includes('Invalid TTS')) {
          setErrorMessage("Text-to-speech unavailable. Text responses will still work.");
          setHasError(true);
        }
      }
    };
    
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [customText, isActivated, onError]);

  const initialize = () => {
    if (isActivated || isProcessing) return;
    
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
    if (!isActivated) {
      window.simliAvatarActive = false;
    }
  }, [isActivated]);

  return (
    <div className="fixed bottom-10 right-10 z-10">
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
          {hasError && !errorMessage.includes("TTS API Key") && !errorMessage.includes("Invalid TTS") && (
            <SimliErrorMessage 
              message={errorMessage}
              onRetry={retryInitialization}
              isProcessing={isProcessing}
            />
          )}
          <div className="min-h-[60px] min-w-[60px]">
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

