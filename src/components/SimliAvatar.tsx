
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  onAvatarReady?: () => void;
  token: string;
  agentId: string;
  customText?: string;
  position?: "left" | "right" | "relative";
  customImage?: string;
  customClassName?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  onAvatarReady,
  token,
  agentId,
  customText = "Financial Analyst",
  position = "right",
  customImage = "",
  customClassName = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const initAttemptRef = useRef(0);

  // Create a safe way to initialize the widget
  const safelyInitializeWidget = () => {
    if (!containerRef.current || isInitialized || isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Safety check - clear any previous content
      if (containerRef.current.firstChild) {
        containerRef.current.innerHTML = '';
      }
      
      // Check if custom element is defined
      if (!window.customElements?.get('simli-widget')) {
        console.log(`Simli custom element not yet defined for ${customText}`);
        
        if (initAttemptRef.current < 3) {
          initAttemptRef.current++;
          setTimeout(safelyInitializeWidget, 1000);
        } else {
          setIsLoading(false);
          toast({
            title: "Widget Error",
            description: `Could not initialize ${customText}. Script not loaded.`,
            variant: "destructive",
          });
        }
        return;
      }
      
      // Create widget
      const widget = document.createElement('simli-widget');
      widget.setAttribute('token', token);
      widget.setAttribute('agentid', agentId);
      widget.setAttribute('position', position);
      if (customImage) {
        widget.setAttribute('customimage', customImage);
      }
      widget.setAttribute('customtext', customText);
      
      // Append widget
      containerRef.current.appendChild(widget);
      
      console.log(`${customText} widget initialized successfully`);
      setIsInitialized(true);
      setIsLoading(false);
      
      if (onAvatarReady) {
        onAvatarReady();
      }
      
    } catch (error) {
      console.error(`Error initializing ${customText}:`, error);
      setIsLoading(false);
      setIsInitialized(false);
      
      toast({
        title: "Error",
        description: `Could not initialize ${customText}. Please refresh the page.`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let messageHandler: EventListener;
    
    // Setup message event listener
    if (agentId) {
      messageHandler = ((event: CustomEvent) => {
        if (event.detail?.message) {
          console.log(`Message received from ${customText}:`, event.detail.message);
          onMessageReceived(event.detail.message);
        }
      }) as EventListener;
      
      window.addEventListener(`simli:message:${agentId}`, messageHandler);
    }

    // Check if Simli is ready every 800ms for 10 seconds
    const checkInterval = setInterval(() => {
      if (window.customElements?.get('simli-widget') && !isInitialized && !isLoading) {
        console.log(`Simli detected, initializing ${customText}...`);
        safelyInitializeWidget();
        clearInterval(checkInterval);
      }
    }, 800);
    
    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!isInitialized && !isLoading) {
        console.log(`Simli initialization timed out for ${customText}`);
      }
    }, 10000);

    return () => {
      // Clean up
      clearInterval(checkInterval);
      clearTimeout(timeout);
      
      if (messageHandler) {
        window.removeEventListener(`simli:message:${agentId}`, messageHandler);
      }
      
      // Safely remove any widget we created
      if (containerRef.current) {
        // Use safer approach to clear the container
        containerRef.current.innerHTML = '';
      }
      
      setIsInitialized(false);
    };
  }, [agentId, onMessageReceived, isInitialized, isLoading, customText]);

  return (
    <div 
      ref={containerRef}
      onClick={isInitialized ? undefined : safelyInitializeWidget}
      className={`simli-avatar-container ${customClassName}`}
    >
      {!isInitialized && (
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
          {isLoading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : (
            <div className="text-xs text-gray-600">Click to init</div>
          )}
        </div>
      )}
    </div>
  );
};
