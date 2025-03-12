
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";

  // Function to safely load the Simli script
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
      simliWidget.setAttribute('customimage', customImageUrl);
      simliWidget.setAttribute('customtext', customText);
      
      // Add a custom attribute to identify this widget
      simliWidget.setAttribute('data-avatar-type', 'financial');
      
      // Append the widget to the container
      containerRef.current.appendChild(simliWidget);
      
      console.log("Financial Analyst widget created with ID:", agentId);
    } catch (error) {
      console.error("Error creating Financial Analyst widget:", error);
      toast.error("Failed to create Financial Analyst widget");
    }
  };

  useEffect(() => {
    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        // Only process events from this avatar type
        const targetElement = event.target as HTMLElement;
        const avatarParent = targetElement.closest('[data-avatar-type="financial"]');
        
        if (avatarParent) {
          console.log("Received message from Financial Analyst:", event.detail.message);
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
        
        // Give more time for the script to fully initialize
        timeoutId = window.setTimeout(() => {
          createSimliWidget();
          setIsInitializing(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to initialize Financial Analyst:", error);
        toast.error("Failed to initialize Financial Analyst");
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
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10" ref={containerRef}>
      {/* Simli widget will be inserted here programmatically */}
    </div>
  );
};
