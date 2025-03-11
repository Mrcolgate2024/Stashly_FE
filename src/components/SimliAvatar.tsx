
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
    // Only initialize once we have the container ref
    if (!containerRef.current) return;

    // We need to re-initialize when token or agentId changes
    if (simliInitializedRef.current) {
      // Clear out existing widget for re-initialization
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        simliInitializedRef.current = false;
      }
    }

    // Add the Simli script if it's not already present
    const scriptSrc = "https://app.simli.com/simli-widget/index.js";
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
      
      // Give the script a moment to load before initializing the widget
      script.onload = initializeWidget;
    } else {
      // Script is already loaded, initialize widget immediately
      initializeWidget();
    }

    function initializeWidget() {
      if (!containerRef.current || simliInitializedRef.current) return;
      
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
      simliInitializedRef.current = true;
      
      console.log(`Simli widget initialized for agent: ${agentId}`);
    }

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        // Clean up any event listeners or widgets
        containerRef.current.innerHTML = '';
        simliInitializedRef.current = false;
      }
    };
  }, [token, agentId, customText, customImage, position]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Avatar clicked: ${customText}`);
    
    // Delegate click to parent if provided
    if (onClick) {
      onClick();
    }
    
    // Find the widget's play button and click it programmatically
    // This is a fallback method if the widget doesn't automatically start
    setTimeout(() => {
      if (containerRef.current) {
        const playButton = containerRef.current.querySelector('.simli-play-button') as HTMLElement;
        if (playButton) {
          console.log('Found play button, clicking it');
          playButton.click();
        } else {
          console.log('No play button found');
        }
      }
    }, 300);
  };

  return (
    <div className="flex flex-col items-center" onClick={handleClick}>
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
