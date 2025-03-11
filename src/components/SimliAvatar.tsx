
import React, { useEffect, useRef } from "react";

interface SimliAvatarProps {
  onMessageReceived?: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
  customImage?: string;
  position?: "left" | "right" | "relative";
  onClick?: () => void;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  token,
  agentId,
  customText,
  customImage,
  position = "relative",
  onClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simliInitializedRef = useRef<boolean>(false);

  useEffect(() => {
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

    // No need for custom event listeners now as we're not integrating with the chat
  }, [token, agentId, customText, customImage, position]);

  // Handle container click to trigger the parent's onClick handler
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex flex-col items-center" onClick={handleContainerClick}>
      {/* The avatar container */}
      <div 
        className="z-10 cursor-pointer flex flex-col items-center" 
        ref={containerRef}
        style={{ minHeight: '60px', minWidth: '60px' }}
      >
        {/* Simli widget will be inserted here programmatically */}
      </div>
      
      {/* The title below the avatar */}
      {customText && (
        <div className="text-xs font-medium mt-2 text-center text-[10px] cursor-pointer">
          {customText}
        </div>
      )}
    </div>
  );
};
