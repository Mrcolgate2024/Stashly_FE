
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const initAttempts = useRef(0);
  const { toast } = useToast();
  const [isReady, setIsReady] = useState(false);

  // Add a click handler for the entire container
  const handleContainerClick = () => {
    console.log(`SimliAvatar container clicked for ${customText}`);
    
    // Force reinitialize on click if we're having issues
    if (!isReady && initAttempts.current > 2) {
      console.log(`Forcing reinitialization for ${customText}`);
      initializeSimliWidget(true);
      return;
    }
    
    // Try to find and click the avatar image
    const avatarElement = containerRef.current?.querySelector('.avatar__img');
    if (avatarElement && avatarElement instanceof HTMLElement) {
      avatarElement.click();
      console.log(`Clicked avatar element for ${customText} from container click`);
    } else {
      // If we can't find the avatar element, try to reinitialize
      console.log(`Avatar element not found for ${customText}, attempting to reinitialize`);
      initializeSimliWidget(true);
    }
  };

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
    
    // Attempt to initialize Simli with a delay to ensure script is loaded
    setTimeout(() => {
      ensureSimliScriptLoaded();
    }, 1000);

    // Further attempts with increasing delays
    const initTimers = [
      setTimeout(() => { if (!isReady) ensureSimliScriptLoaded(); }, 3000),
      setTimeout(() => { if (!isReady) ensureSimliScriptLoaded(); }, 6000),
      setTimeout(() => { if (!isReady) ensureSimliScriptLoaded(); }, 10000)
    ];

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
      initTimers.forEach(timer => clearTimeout(timer));
      console.info(`SimliAvatar component for ${customText} unmounting, cleaning up`);
    };
  }, [token, agentId, onMessageReceived, customText, position, imageUrl, isReady]);

  const ensureSimliScriptLoaded = () => {
    initAttempts.current += 1;
    
    // Check if the custom element is defined
    if (window.customElements && window.customElements.get('simli-widget')) {
      console.log(`Simli widget defined, initializing for ${customText}`);
      initializeSimliWidget();
      return;
    }
    
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
        // Wait a bit after the script loads before initializing
        setTimeout(() => initializeSimliWidget(), 1000);
      };
      
      script.onerror = (error) => {
        console.error(`Error loading Simli script for ${customText}:`, error);
        toast({
          title: "Error",
          description: `Could not load avatar for ${customText}. Please refresh the page.`,
          variant: "destructive",
        });
      };
    } else {
      // Script exists but might not be fully loaded yet
      console.log(`Simli script already exists for ${customText}, checking if it's loaded`);
      setTimeout(() => {
        if (window.customElements && window.customElements.get('simli-widget')) {
          console.log(`Simli widget now defined for ${customText}, initializing`);
          initializeSimliWidget();
        } else {
          console.log(`Simli widget still not defined for ${customText} after waiting`);
        }
      }, 1000);
    }
  };

  const initializeSimliWidget = (forceReinit = false) => {
    if (!containerRef.current) {
      console.log(`Container ref not available for ${customText}`);
      return;
    }
    
    // If we're already initialized and not forcing reinit, don't do it again
    if (simliInitialized.current && !forceReinit) {
      console.log(`Simli widget already initialized for ${customText}, skipping`);
      return;
    }
    
    try {
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
      
      console.info(`Simli widget initialized for ${customText} (agent: ${agentId})`);
      simliInitialized.current = true;
      setIsReady(true);
      
      // Show a toast when the widget is ready
      toast({
        title: "Avatar Ready",
        description: `${customText} is now ready. Click to start a conversation.`,
      });
    } catch (error) {
      console.error(`Error initializing Simli widget for ${customText}:`, error);
      toast({
        title: "Error",
        description: `Could not initialize avatar for ${customText}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className={`simli-avatar-container ${customClassName} ${isReady ? 'avatar-ready' : 'avatar-loading'}`} 
      ref={containerRef}
      onClick={handleContainerClick}
      title={`${customText} - Click to start conversation`}
    >
      {/* Simli widget will be inserted here programmatically */}
      {!isReady && (
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse flex items-center justify-center text-xs text-gray-500">
          Loading...
        </div>
      )}
    </div>
  );
};
