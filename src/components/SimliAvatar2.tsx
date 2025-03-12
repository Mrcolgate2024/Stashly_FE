import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { createSimliWidget } from "@/utils/simliUtils";

interface SimliAvatar2Props {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
}

export const SimliAvatar2: React.FC<SimliAvatar2Props> = ({
  onMessageReceived,
  token,
  agentId,
  customText = "Market Analyst",
}) => {
  const containerId = `market-container-${agentId}`;
  const instanceId = `market-${agentId}`;
  
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  const handleButtonClick = async () => {
    console.log("Market Analyst button clicked", isActive ? "hiding" : "showing");
    
    if (isActive) {
      // Hide and cleanup
      setIsActive(false);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      return;
    }
    
    // Show and initialize
    setIsLoading(true);
    
    try {
      // Initialize widget
      const cleanup = await createSimliWidget(
        containerId,
        instanceId,
        token,
        agentId,
        customText,
        undefined, // No custom image for market analyst
        onMessageReceived
      );
      
      cleanupRef.current = cleanup;
      setIsActive(true);
    } catch (error) {
      console.error("Error initializing Market Analyst widget:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-[80px] left-4 sm:bottom-10 sm:left-10 z-10 flex flex-col items-start gap-2">
      <Button 
        onClick={handleButtonClick}
        variant="outline"
        className="bg-white/90 hover:bg-white"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : isActive ? "Hide" : "Talk to Market Analyst"}
      </Button>
      
      <div 
        id={containerId}
        className={`bg-white/90 p-2 rounded-lg shadow-lg ${isActive ? 'block' : 'hidden'}`}
      >
        {/* Simli widget will be inserted here */}
      </div>
    </div>
  );
};
