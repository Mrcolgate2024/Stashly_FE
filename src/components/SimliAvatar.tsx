
import React, { useEffect, useRef, useState } from "react";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";

  useEffect(() => {
    // Function to handle Simli message events
    const handleSimliMessage = (event: CustomEvent) => {
      console.log("Simli message received:", event.detail);
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

    // Function to load Simli script
    const loadSimliScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
          console.log("Simli script already exists, resolving immediately");
          resolve();
          return;
        }

        console.log("Loading Simli script...");
        const script = document.createElement('script');
        script.src = "https://app.simli.com/simli-widget/index.js";
        script.async = true;
        script.type = "text/javascript";
        
        script.onload = () => {
          console.log("Simli script loaded successfully");
          resolve();
        };
        
        script.onerror = (e) => {
          console.error("Error loading Simli script:", e);
          reject(new Error("Failed to load Simli script"));
        };
        
        document.body.appendChild(script);
      });
    };

    // Function to initialize the Simli widget
    const initializeWidget = () => {
      if (!containerRef.current) {
        console.error("Container ref is null");
        setError("Container initialization failed");
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
        
        // Append the widget to the container
        containerRef.current.appendChild(simliWidget);
        console.log("Simli widget initialized with:", { token, agentId, customText });
        setIsLoaded(true);
      } catch (err) {
        console.error("Error initializing Simli widget:", err);
        setError("Widget initialization failed");
      }
    };

    // Main initialization sequence
    const initialize = async () => {
      try {
        await loadSimliScript();
        // Wait a short time to ensure the script is fully initialized
        setTimeout(() => {
          initializeWidget();
        }, 500);
      } catch (err) {
        console.error("Simli initialization failed:", err);
        setError("Failed to initialize Simli avatar");
      }
    };

    initialize();

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
      console.log("Cleaned up Simli event listeners");
    };
  }, [token, agentId, onMessageReceived, customText]);

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10" ref={containerRef}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {!isLoaded && !error && (
        <div className="flex items-center justify-center p-4 bg-white/80 rounded-full shadow-md">
          <div className="loading-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};
