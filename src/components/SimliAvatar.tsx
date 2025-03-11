
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
  const simliInitializedRef = useRef<boolean>(false);

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
    const scriptSrc = "https://app.simli.com/simli-widget/index.js";
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // Create and append the Simli widget to our container
    if (containerRef.current && !simliInitializedRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create the widget element as per the format in the docs
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
      simliInitializedRef.current = true;
    }

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
    };
  }, [token, agentId, onMessageReceived, customText, customImage, position]);

  // Handle click on the avatar to initiate a chat
  const handleAvatarClick = (e: React.MouseEvent) => {
    // Stop event propagation to prevent issues
    e.stopPropagation();
    
    // Generate a simple greeting message to start the conversation
    const greetingMessage = `Hello, I'm ${customText}. How can I help you today?`;
    console.log("Avatar clicked, sending greeting:", greetingMessage);
    onMessageReceived(greetingMessage);
  };

  return (
    <div className="flex flex-col items-center">
      {/* The avatar container that will be clicked */}
      <div 
        className="z-10 cursor-pointer flex flex-col items-center" 
        ref={containerRef}
        onClick={handleAvatarClick}
        style={{ minHeight: '60px', minWidth: '60px' }}
      >
        {/* Simli widget will be inserted here programmatically */}
      </div>
      
      {/* The title below the avatar */}
      {customText && (
        <div 
          className="text-xs font-medium mt-2 text-center text-[10px] cursor-pointer" 
          onClick={handleAvatarClick}
        >
          {customText}
        </div>
      )}
    </div>
  );
};
