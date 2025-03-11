
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
  const simliInitialized = useRef(false);

  useEffect(() => {
    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      console.log("Simli message received:", event.detail);
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);
    
    // Attempt to initialize Simli
    const initInterval = setInterval(() => {
      if (window.customElements && window.customElements.get('simli-widget')) {
        console.log(`Simli widget defined, initializing for ${customText}`);
        initializeSimliWidget();
        clearInterval(initInterval);
        simliInitialized.current = true;
      } else {
        console.log(`Waiting for Simli widget to be defined for ${customText}...`);
        ensureSimliScriptLoaded();
      }
    }, 1000);

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
      clearInterval(initInterval);
      console.info(`SimliAvatar component for ${customText} unmounting, cleaning up`);
    };
  }, [token, agentId, onMessageReceived, customText, position, imageUrl]);

  const ensureSimliScriptLoaded = () => {
    const existingScript = document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]');
    
    if (!existingScript) {
      console.log(`Simli script not found, adding for ${customText}`);
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
      
      script.onload = () => {
        console.log(`Simli script loaded for ${customText}, initializing widget`);
        initializeSimliWidget();
      };
    } else {
      console.log(`Simli script already exists for ${customText}, checking if it's loaded`);
      // Try to initialize anyway in case the script is loaded but the widget hasn't been initialized
      if (window.customElements && window.customElements.get('simli-widget') && !simliInitialized.current) {
        console.log(`Simli widget defined but not initialized for ${customText}, initializing now`);
        initializeSimliWidget();
        simliInitialized.current = true;
      }
    }
  };

  const initializeSimliWidget = () => {
    if (!containerRef.current) {
      console.log(`Container ref not available for ${customText}`);
      return;
    }
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    try {
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
      
      console.info(`Simli widget initialized for ${customText} (agent: ${agentId})`);
      
      // Give it a moment to render, then try to activate it
      setTimeout(() => {
        if (containerRef.current) {
          const avatarElement = containerRef.current.querySelector('.avatar__img');
          if (avatarElement && avatarElement instanceof HTMLElement) {
            console.log(`Found avatar element for ${customText}, attempting to make it clickable`);
            
            // Attempt to programmatically click it to initialize
            try {
              avatarElement.click();
              console.log(`Clicked avatar for ${customText}`);
            } catch (e) {
              console.error(`Error clicking avatar for ${customText}:`, e);
            }
          } else {
            console.log(`Avatar element not found for ${customText}`);
          }
        }
      }, 2000);
    } catch (error) {
      console.error(`Error initializing Simli widget for ${customText}:`, error);
    }
  };

  return (
    <div 
      className={`simli-avatar-container ${customClassName}`} 
      ref={containerRef}
      onClick={() => {
        console.log(`SimliAvatar container clicked for ${customText}`);
        const avatarElement = containerRef.current?.querySelector('.avatar__img');
        if (avatarElement && avatarElement instanceof HTMLElement) {
          avatarElement.click();
          console.log(`Clicked avatar element for ${customText} from container click`);
        }
      }}
    >
      {/* Simli widget will be inserted here programmatically */}
    </div>
  );
};
