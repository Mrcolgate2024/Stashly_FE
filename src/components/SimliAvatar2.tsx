
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const instanceId = `market-${agentId}`;
  const messageHandlerRef = useRef<any>(null);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      if (messageHandlerRef.current) {
        window.removeEventListener('simli:message' as any, messageHandlerRef.current);
        messageHandlerRef.current = null;
      }
    };
  }, []);

  const loadSimliScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Make sure window globals are initialized
      if (typeof window !== 'undefined') {
        if (!window.simliScriptLoaded) {
          window.simliScriptLoaded = false;
        }
        if (!window.simliWidgetInstances) {
          window.simliWidgetInstances = {};
        }
      }

      if (window.simliScriptLoaded) {
        console.log("Simli script already loaded");
        resolve();
        return;
      }

      const existingScript = document.getElementById('simli-widget-script');
      if (existingScript) {
        console.log("Found existing script element");
        window.simliScriptLoaded = true;
        resolve();
        return;
      }

      console.log("Loading Simli script");
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      script.id = "simli-widget-script";
      
      script.onload = () => {
        console.log("Simli script loaded successfully");
        window.simliScriptLoaded = true;
        resolve();
      };
      
      script.onerror = (error) => {
        console.error("Error loading Simli script:", error);
        toast.error("Failed to load avatar script");
        reject(error);
      };
      
      document.body.appendChild(script);
    });
  };

  const cleanupWidget = () => {
    if (messageHandlerRef.current) {
      window.removeEventListener('simli:message' as any, messageHandlerRef.current);
      messageHandlerRef.current = null;
    }
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
    // Clean up instance reference
    if (window.simliWidgetInstances && window.simliWidgetInstances[instanceId]) {
      delete window.simliWidgetInstances[instanceId];
    }
  };

  const initializeWidget = async () => {
    if (!containerRef.current) return;
    
    setIsLoading(true);
    console.log("Initializing Market Analyst widget");
    
    try {
      // Load the script first
      await loadSimliScript();
      
      // Clear existing content
      containerRef.current.innerHTML = '';
      
      // Create new widget
      const simliWidget = document.createElement('simli-widget');
      simliWidget.setAttribute('token', token);
      simliWidget.setAttribute('agentid', agentId);
      simliWidget.setAttribute('position', 'relative');
      simliWidget.setAttribute('customtext', customText);
      simliWidget.setAttribute('data-instance-id', instanceId);
      
      containerRef.current.appendChild(simliWidget);
      
      // Store instance reference
      window.simliWidgetInstances[instanceId] = simliWidget;
      
      console.log("Market Analyst widget created");
      
      // Set up message event handler
      const handleMessage = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && customEvent.detail.message) {
          const targetElement = customEvent.target as HTMLElement;
          const elementId = targetElement.getAttribute('data-instance-id');
          
          if (elementId === instanceId) {
            console.log("Message from Market Analyst:", customEvent.detail.message);
            onMessageReceived(customEvent.detail.message);
          }
        }
      };

      // Save reference to the handler for cleanup
      messageHandlerRef.current = handleMessage;
      
      window.addEventListener('simli:message' as any, handleMessage as EventListener);
      
      setIsActive(true);
    } catch (error) {
      console.error("Error initializing Market Analyst widget:", error);
      toast.error("Failed to initialize Market Analyst");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    console.log("Market Analyst button clicked", isActive ? "hiding" : "showing");
    
    if (!isActive) {
      initializeWidget();
    } else {
      // If already active, just toggle visibility
      setIsActive(false);
      cleanupWidget();
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
      {isActive && (
        <div ref={containerRef} className="bg-white/90 p-2 rounded-lg shadow-lg">
          {/* Simli widget will be inserted here */}
        </div>
      )}
    </div>
  );
};
