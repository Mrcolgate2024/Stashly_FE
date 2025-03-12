
import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";

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
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";
  const [isActivated, setIsActivated] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Listen for errors from Simli
    const handleError = (event: Event) => {
      if (event instanceof CustomEvent && event.detail && 
         (event.detail.error || event.detail.message?.includes('error'))) {
        console.error("Simli error detected:", event.detail);
        setHasError(true);
      }
    };
    
    window.addEventListener('simli:error' as any, handleError as EventListener);
    
    return () => {
      window.removeEventListener('simli:error' as any, handleError as EventListener);
    };
  }, []);

  const initializeSimli = () => {
    if (isActivated) return; // Already initialized
    setHasError(false); // Reset error state on retry
    console.log("Initializing Financial Analyst avatar...");
    setIsActivated(true);

    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:financial:message' as any, handleSimliMessage as EventListener);

    // We'll only add the script when initializing for the first time
    if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
      
      // Listen for script load errors
      script.onerror = () => {
        console.error("Failed to load Simli script");
        setHasError(true);
        setIsActivated(false);
      };
    }

    // Create and append the Simli widget to our container
    setTimeout(() => {
      if (containerRef.current) {
        try {
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Create the widget element
          const simliWidget = document.createElement('simli-widget');
          // Use a new token
          simliWidget.setAttribute('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRiMzk4YjkwLTVmOTYtNGJiNS1hOWVhLWE3ZjZiOTdkYTAxZSIsImlhdCI6MTcxMDIzMDA1MywiZXhwIjoxNzQxNzg3NjUzfQ.QkiRiILPLx5SEUP7SKOhJcKTVLFm_Cqz46JqFOZG2eo");
          simliWidget.setAttribute('agentid', agentId);
          simliWidget.setAttribute('position', 'right');
          simliWidget.setAttribute('customimage', customImageUrl);
          simliWidget.setAttribute('customtext', customText);
          
          // Set a custom event name for this specific avatar
          simliWidget.setAttribute('eventname', 'simli:financial:message');
          
          // Add error listener to the widget
          simliWidget.addEventListener('error', (e) => {
            console.error("Widget error:", e);
            setHasError(true);
          });
          
          // Append the widget to the container
          containerRef.current.appendChild(simliWidget);
          console.log("Financial Analyst avatar widget added to DOM");
        } catch (err) {
          console.error("Error initializing Simli widget:", err);
          setHasError(true);
          setIsActivated(false);
        }
      }
    }, 500); // Short delay to ensure DOM is ready
  };

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10">
      {!isActivated ? (
        <Button 
          onClick={initializeSimli}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src={customImageUrl} 
              alt={customText} 
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
              }}
            />
          </div>
        </Button>
      ) : (
        <div className="relative">
          {hasError && (
            <Button 
              onClick={() => {
                setIsActivated(false);
                setTimeout(initializeSimli, 100);
              }}
              className="absolute -top-10 right-0 bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
            >
              Retry
            </Button>
          )}
          <div ref={containerRef} className="min-h-[60px] min-w-[60px] bg-gray-100/30 rounded-full">
            {/* Simli widget will be inserted here programmatically */}
          </div>
        </div>
      )}
    </div>
  );
};
