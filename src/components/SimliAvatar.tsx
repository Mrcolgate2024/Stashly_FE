
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
  
  const FINANCIAL_ANALYST_TOKEN = "gAAAAABn0dDXLk0o0H5uQWBU9jnpTDVUuukDGqMubTQfc6nF1rngpGJLQ9xctKg9iUVHC7IZYR8RHJ4Q5rLjnQRKHlWiYlN-VC3uazW1DMmpepV-MyVzVmCn8dncpRPs7ldyK7NbwRUOj1aNt96TkBHgd3pkfBdoe4po1zA0BIANvs11pbHNsROfAwbybnsY_lAtp4utAw7jk9jBLVOFiAVtaHup7loSqGdcGMGQOajIlA93oV7_hzdT1fQCULCYzMhBn-tlYCt2JBySSc7xxYdlzwqtne6q6QOND0-G72O35MfVm36cYpaKr7qQyphbqXo1KuB6YzR4Ynk6OyMhSrjJESr2htfEC7t7LUhygtt3mMDp0hNMOD_1ZS1-3O0bAKFMzKf_I0sEFiKV_-whEdvB1m_UP5-KNuAdisDryg8EVQcqIWogux5hsexCvJa4JxRi9vpnmZiz4wnWhQ0xg9Z7uLulX_1Oi-u2-2_jEDn6Ed2wi0D9Cv7J5yJ_KskEVog3BxGUJVhZ";

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
      }
    };

    window.addEventListener('simli:financial:message' as any, handleSimliMessage as EventListener);
    window.addEventListener('simli:error' as any, handleSimliError as EventListener);
    
    return () => {
      window.removeEventListener('simli:financial:message' as any, handleSimliMessage as EventListener);
      window.removeEventListener('simli:error' as any, handleSimliError as EventListener);
    };
  }, [customText, onMessageReceived, onError]);

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
          {hasError && (
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
