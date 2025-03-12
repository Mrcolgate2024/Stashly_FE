
import React, { useRef, useState } from "react";

interface MarketAnalystAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
}

export const MarketAnalystAvatar: React.FC<MarketAnalystAvatarProps> = ({
  onMessageReceived,
  token,
  agentId,
  customText = "Market Analyst",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActivated, setIsActivated] = useState(false);
  
  const initializeSimli = () => {
    if (isActivated) return; // Already initialized
    setIsActivated(true);

    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:market:message' as any, handleSimliMessage as EventListener);

    // Add the Simli script if it's not already present
    if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // Create and append the Simli widget to our container
    if (containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create the widget element
      const simliWidget = document.createElement('simli-widget');
      simliWidget.setAttribute('token', token);
      simliWidget.setAttribute('agentid', agentId);
      simliWidget.setAttribute('position', 'left'); // Position on the left
      simliWidget.setAttribute('customtext', customText);
      
      // Set a custom event name for this specific avatar
      simliWidget.setAttribute('eventname', 'simli:market:message');
      
      // Append the widget to the container
      containerRef.current.appendChild(simliWidget);
    }

    // Return a cleanup function
    return () => {
      window.removeEventListener('simli:market:message' as any, handleSimliMessage as EventListener);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  };

  return (
    <div className="fixed bottom-[80px] left-4 sm:bottom-10 sm:left-10 z-10">
      {!isActivated ? (
        <button 
          onClick={initializeSimli}
          className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors"
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <span className="text-xl font-bold">MA</span>
          </div>
        </button>
      ) : (
        <div ref={containerRef}>
          {/* Simli widget will be inserted here programmatically */}
        </div>
      )}
    </div>
  );
};
