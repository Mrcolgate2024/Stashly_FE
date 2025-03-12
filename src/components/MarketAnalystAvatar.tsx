
import React, { useState, useEffect } from "react";
import { AvatarButton } from "./AvatarButton";
import { SimliErrorMessage } from "./SimliErrorMessage";
import { toast } from "@/hooks/use-toast";

interface MarketAnalystAvatarProps {
  onMessageReceived: (message: string) => void;
  agentId: string;
  customText?: string;
}

export const MarketAnalystAvatar: React.FC<MarketAnalystAvatarProps> = ({
  onMessageReceived,
  agentId,
  customText = "Market Analyst",
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const MARKET_ANALYST_TOKEN = "gAAAAABn0WhoVTdSnRpLy7op0O79gAka6U1SfH7GCpjx-dIc37msMAii2eFpvsrwKqANei9SvQOY1GDN1QiSqF-AkIwxRvnsw82_6chiyQ2YT1jiAQkZtmsJidt_Wq2aIwZFRcwtUpaqoKBExOGmwvv7Et2Av-AQV9VFMyjiph_X6QGcHraeVUgGIRc_cSIMCvKCv4apFOMgv8onii6wiWVcItyhXl0ebMhlRVOX7O1XU4S1kTXV27LkXuTrDmMAFK7MkxV9mwV6XEqylxl_N8qaVvh_578hVHIsk1PRDkQfJ14ZVONwmt45w3o8xOpvFithxj8C4eS3XywkVTG9JKG9EbbHIUpoll_xbR2kg0Qz2vgjGEdkS_npQHK9ayVXUNhQW3bMwBP2Tlnxg2iF3Wv7y5t7Q01jQgaa2cZVvMIiZ3BQmpjCZrCxbDaBagCpG1Zzn4EeHz_QCACKFax6AAzGB0YdW8uO0pq_2PvBon2pcLnE91Jng21Y3GJTL2bxmFaI9P-fnY9d";

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

    window.addEventListener('simli:market:message' as any, handleSimliMessage as EventListener);
    window.addEventListener('simli:error' as any, handleSimliError as EventListener);
    
    return () => {
      window.removeEventListener('simli:market:message' as any, handleSimliMessage as EventListener);
      window.removeEventListener('simli:error' as any, handleSimliError as EventListener);
    };
  }, [customText, onMessageReceived]);

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
  }, [customText, isActivated]);

  return (
    <div className="fixed bottom-10 left-10 z-10">
      {!isActivated ? (
        <AvatarButton
          onClick={initialize}
          isProcessing={isProcessing}
          bgColor="bg-green-500"
          hoverColor="hover:bg-green-600"
          initials="MA"
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
            <div id="market-analyst-container">
              <simli-widget 
                token={`${MARKET_ANALYST_TOKEN}`}
                agentid={agentId}
                position="left"
                eventname="simli:market:message"
                customtext={customText}
              ></simli-widget>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
