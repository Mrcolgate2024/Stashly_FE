import React, { useState, useEffect } from "react";
import { AvatarButton } from "./AvatarButton";
import { SimliErrorMessage } from "./SimliErrorMessage";
import { toast } from "@/hooks/use-toast";

export interface BaseAvatarProps {
  onMessageReceived: (message: string) => void;
  onError?: (error: string) => void;
  agentId: string;
  customText: string;
  token: string;
  eventName: string;
  position: "left" | "right";
  bgColor: string;
  hoverColor: string;
  initials?: string;
  imageUrl?: string;
  disableTTS?: boolean;
}

export const BaseAvatar: React.FC<BaseAvatarProps> = ({
  onMessageReceived,
  onError,
  agentId,
  customText,
  token,
  eventName,
  position,
  bgColor,
  hoverColor,
  initials,
  imageUrl,
  disableTTS = false,
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        
        if (disableTTS && (message.includes("TTS API Key") || message.includes("Invalid TTS"))) {
          console.warn("TTS API Key error ignored as TTS is disabled for this avatar");
          if (onError) {
            onError(message);
          }
          
          return;
        }
        
        setHasError(true);
        setErrorMessage(message);
        
        if (onError) {
          onError(message);
        }
        
        if (message.includes("401") || 
            message.includes("unauthorized") || 
            message.includes("Unauthorized") ||
            message.includes("Invalid")) {
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

    window.addEventListener(eventName as any, handleSimliMessage as EventListener);
    window.addEventListener('simli:error' as any, handleSimliError as EventListener);
    
    return () => {
      window.removeEventListener(eventName as any, handleSimliMessage as EventListener);
      window.removeEventListener('simli:error' as any, handleSimliError as EventListener);
    };
  }, [customText, onMessageReceived, onError, eventName, disableTTS]);

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
          if (disableTTS && (event.message.includes("TTS API Key") || event.message.includes("Invalid TTS"))) {
            console.warn("TTS API Key error ignored as TTS is disabled for this avatar");
            
            if (onError) {
              onError(event.message);
            }
            
            return;
          }
          
          setHasError(true);
          setErrorMessage(event.message);
          
          if (isActivated) {
            toast({
              title: "Avatar Connection Issue",
              description: `${customText} encountered an error: ${event.message.slice(0, 50)}...`,
              variant: "destructive",
            });
          }
        }
      }
    };
    
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [customText, isActivated, onError, disableTTS]);

  const containerClass = position === "left" ? "fixed bottom-10 left-10 z-10" : "fixed bottom-10 right-10 z-10";

  return (
    <div className={containerClass}>
      {!isActivated ? (
        <AvatarButton
          onClick={initialize}
          isProcessing={isProcessing}
          bgColor={bgColor}
          hoverColor={hoverColor}
          initials={initials}
          imageUrl={imageUrl}
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
            <div id={`${customText.toLowerCase().replace(/\s+/g, '-')}-container`}>
              <simli-widget 
                token={token}
                agentid={agentId}
                position={position}
                eventname={eventName}
                customtext={customText}
                customimage={imageUrl}
                disabletts={disableTTS ? "true" : "false"}
              ></simli-widget>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
