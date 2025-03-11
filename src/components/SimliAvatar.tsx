
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

  const initializeSimliWidget = () => {
    if (!containerRef.current || isInitialized) return;
    
    try {
      setIsLoading(true);
      
      // Clear container
      containerRef.current.innerHTML = '';
      
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
      
      setIsInitialized(true);
      setIsLoading(false);
      
      if (onAvatarReady) {
        onAvatarReady();
      }
      
    } catch (error) {
      console.error(`Error initializing ${customText}:`, error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: `Could not initialize ${customText}. Please refresh the page.`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkAndInitialize = () => {
      if (window.customElements?.get('simli-widget')) {
        initializeSimliWidget();
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && !isInitialized) {
          checkAndInitialize();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    checkAndInitialize();

    // Custom event listener for messages
    const handleMessage = (event: CustomEvent) => {
      if (event.detail?.message) {
        onMessageReceived(event.detail.message);
      }
    };

    window.addEventListener(`simli:message:${agentId}` as any, handleMessage as EventListener);

    return () => {
      observer.disconnect();
      window.removeEventListener(`simli:message:${agentId}` as any, handleMessage as EventListener);
      
      // Clean up widget
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [agentId, onMessageReceived, isInitialized]);

  const handleContainerClick = () => {
    if (!isInitialized) {
      initializeSimliWidget();
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className={`simli-avatar-container ${customClassName}`}
    >
      {!isInitialized && (
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
          {isLoading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : (
            <div className="text-sm text-gray-600">Click to init</div>
          )}
        </div>
      )}
    </div>
  );
};
