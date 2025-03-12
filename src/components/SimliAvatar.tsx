
import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { createSimliWidget } from "@/utils/simliUtils";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  token,
  agentId,
  customText = "Financial Analyst",
}) => {
  const containerId = `financial-container-${agentId}`;
  const instanceId = `financial-${agentId}`;
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";
  
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
    console.log("Financial Analyst button clicked", isActive ? "hiding" : "showing");
    
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
        customImageUrl,
        onMessageReceived
      );
      
      cleanupRef.current = cleanup;
      setIsActive(true);
    } catch (error) {
      console.error("Error initializing Financial Analyst widget:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10 flex flex-col items-end gap-2">
      <Button 
        onClick={handleButtonClick}
        variant="outline"
        className="bg-white/90 hover:bg-white"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : isActive ? "Hide" : "Talk to Financial Analyst"}
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
