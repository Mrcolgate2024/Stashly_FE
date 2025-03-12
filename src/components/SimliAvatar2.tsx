
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const instanceId = "market-analyst";

  // Function to safely load the Simli script - checks if already loaded by SimliAvatar
  const loadSimliScript = () => {
    return new Promise<void>((resolve, reject) => {
      // Create a unique ID for this script instance
      const scriptId = "simli-widget-script";
      
      if (document.querySelector(`script[id="${scriptId}"]`)) {
        console.log("Simli script already loaded, reusing existing script");
        setIsScriptLoaded(true);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.id = scriptId;
      script.async = true;
      script.type = "text/javascript";
      
      script.onload = () => {
        console.log("Simli script loaded successfully for Market Analyst");
        setIsScriptLoaded(true);
        resolve();
      };
      
      script.onerror = (error) => {
        console.error("Error loading Simli script for Market Analyst:", error);
        toast.error("Failed to load Market Analyst avatar");
        reject(error);
      };
      
      document.body.appendChild(script);
    });
  };

  // Function to create and append the Simli widget with better error handling
  const createSimliWidget = () => {
    if (!containerRef.current) {
      console.error("Container ref is null, cannot create widget");
      return false;
    }
    
    try {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create the widget element
      const simliWidget = document.createElement('simli-widget');
      simliWidget.setAttribute('token', token);
      simliWidget.setAttribute('agentid', agentId);
      simliWidget.setAttribute('position', 'relative');
      simliWidget.setAttribute('customtext', customText);
      
      // Add custom attributes to identify this specific widget instance
      simliWidget.setAttribute('data-avatar-type', 'market');
      simliWidget.setAttribute('data-instance-id', instanceId);
      
      // Append the widget to the container
      containerRef.current.appendChild(simliWidget);
      
      console.log("Market Analyst widget created with ID:", agentId);
      return true;
    } catch (error) {
      console.error("Error creating Market Analyst widget:", error);
      toast.error("Failed to create Market Analyst widget");
      return false;
    }
  };

  useEffect(() => {
    // Create a custom event listener for Simli messages with unique instance handling
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        // Only process events from this specific avatar instance
        const targetElement = event.target as HTMLElement;
        const avatarInstance = targetElement.closest(`[data-instance-id="${instanceId}"]`);
        
        if (avatarInstance) {
          console.log("Received message from Market Analyst:", event.detail.message);
          onMessageReceived(event.detail.message);
        }
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

    // Load the script and then create the widget with progressive delays and retries
    let timeoutId: number;
    let retryCount = 0;
    const maxRetries = 3;
    
    const initialize = async () => {
      if (isInitializing || isInitialized) return;
      
      setIsInitializing(true);
      
      try {
        await loadSimliScript();
        
        // Even longer delay for second avatar to prevent conflicts
        // Staggering the creation times helps avoid initialization conflicts
        const delay = 2500 + (retryCount * 500);
        console.log(`Initializing Market Analyst with ${delay}ms delay (attempt ${retryCount + 1})`);
        
        timeoutId = window.setTimeout(() => {
          const success = createSimliWidget();
          if (success) {
            setIsInitialized(true);
            console.log("Market Analyst successfully initialized");
          } else if (retryCount < maxRetries) {
            console.log(`Retrying Market Analyst initialization (${retryCount + 1}/${maxRetries})`);
            retryCount++;
            setIsInitializing(false);
            initialize();
          } else {
            console.error("Maximum retries reached for Market Analyst initialization");
            toast.error("Failed to initialize Market Analyst after multiple attempts");
            setIsInitializing(false);
          }
        }, delay);
      } catch (error) {
        console.error("Failed to initialize Market Analyst:", error);
        toast.error("Failed to initialize Market Analyst");
        setIsInitializing(false);
      }
    };

    initialize();

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
      window.clearTimeout(timeoutId);
      setIsInitialized(false);
      setIsInitializing(false);
    };
  }, [token, agentId, onMessageReceived, customText, instanceId]);

  return (
    <div className="fixed bottom-[80px] left-4 sm:bottom-10 sm:left-10 z-10" ref={containerRef}>
      {/* Simli widget will be inserted here programmatically */}
    </div>
  );
};
