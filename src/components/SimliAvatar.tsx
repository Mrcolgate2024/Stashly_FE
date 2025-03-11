
import React, { useEffect, useRef, useState } from "react";

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
  const [isActive, setIsActive] = useState<boolean>(false);

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
      
      // Wait a bit longer for the script to fully initialize
      setTimeout(() => {
        initializeWidget();
      }, 500);
    } else {
      // Script is already loaded, initialize widget with a slight delay
      setTimeout(() => {
        initializeWidget();
      }, 100);
    }

    function initializeWidget() {
      if (!containerRef.current || simliInitializedRef.current) return;
      
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create the widget element manually to ensure proper attributes
      const simliWidget = document.createElement('div');
      simliWidget.innerHTML = `<simli-widget token="${token}" agentid="${agentId}" position="${position}" ${customImage ? `customimage="${customImage}"` : ''} ${customText ? `customtext="${customText}"` : ''}></simli-widget>`;
      
      // Append the widget to the container
      containerRef.current.appendChild(simliWidget.firstChild as Node);
      simliInitializedRef.current = true;
      
      console.log(`Simli widget initialized for agent: ${agentId}`);
    }

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        // Clean up any event listeners or widgets
        try {
          containerRef.current.innerHTML = '';
          simliInitializedRef.current = false;
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }
    };
  }, [token, agentId, customText, customImage, position]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(true);
    
    console.log(`Avatar clicked: ${customText}`);
    
    // Delegate click to parent if provided
    if (onClick) {
      onClick();
    }
    
    // Find and click the play button after a delay to ensure the widget is ready
    setTimeout(() => {
      if (containerRef.current) {
        // Try multiple selectors that might be used by the Simli widget
        let playButton = containerRef.current.querySelector('.simli-play-button') as HTMLElement;
        
        if (!playButton) {
          // Try other possible selectors
          playButton = containerRef.current.querySelector('button[aria-label="Start"]') as HTMLElement;
        }
        
        if (!playButton) {
          // Try finding any button within the widget
          const allButtons = containerRef.current.querySelectorAll('button');
          if (allButtons.length > 0) {
            playButton = allButtons[0] as HTMLElement;
          }
        }
        
        if (playButton) {
          console.log('Found play button, clicking it');
          playButton.click();
        } else {
          // Try clicking directly on the simli-widget element
          const widget = containerRef.current.querySelector('simli-widget') as HTMLElement;
          if (widget) {
            console.log('Clicking directly on the simli-widget element');
            widget.click();
          } else {
            console.log('No play button or widget found');
          }
        }
      }
    }, 500);
  };

  return (
    <div 
      className={`flex flex-col items-center transition-transform ${isActive ? 'scale-105' : ''}`} 
      onClick={handleClick}
    >
      {/* The avatar container */}
      <div 
        className="z-10 cursor-pointer flex flex-col items-center hover:brightness-110 transition-all" 
        ref={containerRef}
        style={{ minHeight: '60px', minWidth: '60px' }}
      >
        {/* Simli widget will be inserted here programmatically */}
      </div>
      
      {/* The title below the avatar */}
      {customText && (
        <div className="text-xs font-medium mt-2 text-center text-[10px] cursor-pointer hover:text-white transition-colors">
          {customText}
        </div>
      )}
    </div>
  );
};
