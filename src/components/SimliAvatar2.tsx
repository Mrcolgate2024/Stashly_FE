
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

  // Function to safely load the Simli script - checks if already loaded by SimliAvatar
  const loadSimliScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (document.querySelector('script[id="simli-widget-script"]')) {
        setIsScriptLoaded(true);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.id = "simli-widget-script";
      script.async = true;
      script.type = "text/javascript";
      
      script.onload = () => {
        console.log("Simli script loaded successfully");
        setIsScriptLoaded(true);
        resolve();
      };
      
      script.onerror = (error) => {
        console.error("Error loading Simli script:", error);
        reject(error);
      };
      
      document.body.appendChild(script);
    });
  };

  // Function to create and append the Simli widget
  const createSimliWidget = () => {
    if (!containerRef.current) {
      console.error("Container ref is null, cannot create widget");
      return;
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
      
      // Add a custom attribute to identify this widget
      simliWidget.setAttribute('data-avatar-type', 'market');
      
      // Append the widget to the container
      containerRef.current.appendChild(simliWidget);
      
      console.log("Market Analyst widget created with ID:", agentId);
    } catch (error) {
      console.error("Error creating Market Analyst widget:", error);
      toast.error("Failed to create Market Analyst widget");
    }
  };

  useEffect(() => {
    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        // Only process events from this avatar type
        const targetElement = event.target as HTMLElement;
        const avatarParent = targetElement.closest('[data-avatar-type="market"]');
        
        if (avatarParent) {
          console.log("Received message from Market Analyst:", event.detail.message);
          onMessageReceived(event.detail.message);
        }
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

    // Load the script and then create the widget
    let timeoutId: number;
    
    const initialize = async () => {
      if (isInitializing) return;
      
      setIsInitializing(true);
      
      try {
        await loadSimliScript();
        
        // Wait a longer moment for the script to fully initialize
        // Staggering the creation times to avoid conflicts
        timeoutId = window.setTimeout(() => {
          createSimliWidget();
          setIsInitializing(false);
        }, 1500); // Slightly longer delay for second avatar
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
    };
  }, [token, agentId, onMessageReceived, customText]);

  return (
    <div className="fixed bottom-[80px] left-4 sm:bottom-10 sm:left-10 z-10" ref={containerRef}>
      {/* Simli widget will be inserted here programmatically */}
    </div>
  );
};
