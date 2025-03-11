
import React, { useEffect, useRef } from "react";

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

  useEffect(() => {
    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

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
      simliWidget.setAttribute('position', 'relative');
      simliWidget.setAttribute('customimage', customImageUrl);
      simliWidget.setAttribute('customtext', customText);
      
      // Append the widget to the container
      containerRef.current.appendChild(simliWidget);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
    };
  }, [token, agentId, onMessageReceived, customText]);

  return (
    <div className="fixed bottom-10 right-10 z-10" ref={containerRef}>
      {/* Simli widget will be inserted here programmatically */}
    </div>
  );
};
