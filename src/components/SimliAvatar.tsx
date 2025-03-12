
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
  const [isInitialized, setIsInitialized] = useState(false);
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";

  // Ensure we have a global state tracker for script loading
  useEffect(() => {
    // Setup global window property to track script loading
    if (typeof window !== 'undefined') {
      window.simliScriptLoaded = window.simliScriptLoaded || false;
      window.simliWidgetInstances = window.simliWidgetInstances || {};
    }
  }, []);

  useEffect(() => {
    // Use separate containerRefs to ensure widgets don't interfere
    if (!containerRef.current || isInitialized) return;

    const initializeWidget = async () => {
      try {
        // Load script if not already loaded
        if (!window.simliScriptLoaded) {
          await new Promise<void>((resolve, reject) => {
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
        }
        
        // Wait to ensure DOM is ready and script is processed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear existing content and create new widget
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          
          const simliWidget = document.createElement('simli-widget');
          simliWidget.setAttribute('token', token);
          simliWidget.setAttribute('agentid', agentId);
          simliWidget.setAttribute('position', 'relative');
          simliWidget.setAttribute('customimage', customImageUrl);
          simliWidget.setAttribute('customtext', customText);
          simliWidget.setAttribute('data-instance-id', `financial-${agentId}`);
          
          containerRef.current.appendChild(simliWidget);
          
          // Store instance reference
          window.simliWidgetInstances[`financial-${agentId}`] = simliWidget;
          
          setIsInitialized(true);
          console.log("Financial Analyst widget created");
        }
      } catch (error) {
        console.error("Error initializing Financial Analyst widget:", error);
        toast.error("Failed to initialize Financial Analyst");
      }
    };

    // Start initialization with delay
    const timeoutId = setTimeout(() => {
      initializeWidget();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [token, agentId, customText, isInitialized]);

  useEffect(() => {
    // Set up message event handler
    const handleMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.message) {
        // Verify this message is from our widget
        const targetElement = customEvent.target as HTMLElement;
        const instanceId = targetElement.getAttribute('data-instance-id');
        
        if (instanceId === `financial-${agentId}`) {
          console.log("Message from Financial Analyst:", customEvent.detail.message);
          onMessageReceived(customEvent.detail.message);
        }
      }
    };

    // Add event listener
    window.addEventListener('simli:message' as any, handleMessage as EventListener);

    return () => {
      window.removeEventListener('simli:message' as any, handleMessage as EventListener);
    };
  }, [onMessageReceived, agentId]);

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10" ref={containerRef}>
      {/* Simli widget will be inserted here */}
    </div>
  );
};

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    simliScriptLoaded: boolean;
    simliWidgetInstances: Record<string, HTMLElement>;
  }
}
