
import React, { useEffect, useRef } from "react";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
  position?: "left" | "right" | "relative";
  customImage?: string;
  customClassName?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  token,
  agentId,
  customText = "Financial Analyst",
  position = "right",
  customImage = "",
  customClassName = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultImage = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";
  const imageUrl = customImage || defaultImage;

  useEffect(() => {
    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

    // Make sure Simli script is loaded
    ensureSimliScriptLoaded();

    // Initialize Simli widget
    initializeSimliWidget();

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
      console.info("Chat component unmounting, cleaning up");
    };
  }, [token, agentId, onMessageReceived, customText, position, imageUrl]);

  const ensureSimliScriptLoaded = () => {
    if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
      
      script.onload = () => {
        console.log(`Simli script loaded, initializing widget for ${customText}`);
        initializeSimliWidget();
      };
    }
  };

  const initializeSimliWidget = () => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    // Create the widget element
    const simliWidget = document.createElement('simli-widget');
    simliWidget.setAttribute('token', token);
    simliWidget.setAttribute('agentid', agentId);
    simliWidget.setAttribute('position', position);
    
    if (imageUrl) {
      simliWidget.setAttribute('customimage', imageUrl);
    }
    
    simliWidget.setAttribute('customtext', customText);
    
    // Append the widget to the container
    containerRef.current.appendChild(simliWidget);
    
    console.info(`Simli widget initialized for agent: ${agentId}`);
    
    // Give it a moment to render, then try to activate it
    setTimeout(() => {
      if (containerRef.current) {
        const playButton = containerRef.current.querySelector('.avatar__img');
        if (playButton && playButton instanceof HTMLElement) {
          console.log(`Found play button for ${customText}, attempting to make it clickable`);
        }
      }
    }, 1000);
  };

  return (
    <div className={customClassName} ref={containerRef}>
      {/* Simli widget will be inserted here programmatically */}
    </div>
  );
};
