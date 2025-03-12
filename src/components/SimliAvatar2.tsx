
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
  const [isInitialized, setIsInitialized] = useState(false);

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
            // Check again in case another component loaded it
            if (document.getElementById('simli-widget-script')) {
              window.simliScriptLoaded = true;
              resolve();
              return;
            }
            
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
        
        // Wait longer for the second avatar to ensure no conflicts
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Clear existing content and create new widget
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          
          const simliWidget = document.createElement('simli-widget');
          simliWidget.setAttribute('token', token);
          simliWidget.setAttribute('agentid', agentId);
          simliWidget.setAttribute('position', 'relative');
          simliWidget.setAttribute('customtext', customText);
          simliWidget.setAttribute('data-instance-id', `market-${agentId}`);
          
          containerRef.current.appendChild(simliWidget);
          
          // Store instance reference
          window.simliWidgetInstances[`market-${agentId}`] = simliWidget;
          
          setIsInitialized(true);
          console.log("Market Analyst widget created");
        }
      } catch (error) {
        console.error("Error initializing Market Analyst widget:", error);
        toast.error("Failed to initialize Market Analyst");
      }
    };

    // Start initialization with delay to ensure Financial Analyst loads first
    const timeoutId = setTimeout(() => {
      initializeWidget();
    }, 3000); // Longer delay for second avatar

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
        
        if (instanceId === `market-${agentId}`) {
          console.log("Message from Market Analyst:", customEvent.detail.message);
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
    <div className="fixed bottom-[80px] left-4 sm:bottom-10 sm:left-10 z-10" ref={containerRef}>
      {/* Simli widget will be inserted here */}
    </div>
  );
};

// TypeScript declaration is in SimliAvatar.tsx
