
import React, { useEffect, useRef } from "react";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
  customImage?: string;
  position?: "left" | "right" | "relative";
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  token,
  agentId,
  customText,
  customImage,
  position = "relative"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
      simliWidget.setAttribute('position', position);
      
      if (customImage) {
        simliWidget.setAttribute('customimage', customImage);
      }
      
      if (customText) {
        simliWidget.setAttribute('customtext', customText);
      }
      
      // Append the widget to the container
      containerRef.current.appendChild(simliWidget);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
    };
  }, [token, agentId, onMessageReceived, customText, customImage, position]);

  return (
    <div className="z-10 flex flex-col items-center" ref={containerRef}>
      {/* Simli widget will be inserted here programmatically */}
      {customText && (
        <div className="text-xs font-medium mt-2 text-center text-[10px]">{customText}</div>
      )}
    </div>
  );
};
