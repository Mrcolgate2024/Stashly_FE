
import React, { useEffect, useRef, useState } from "react";
import { env } from "@/config/env";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token?: string;
  agentId: string;
  customText?: string;
  apiKey?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  token,
  agentId,
  customText = "Financial Analyst",
  apiKey,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const customImageUrl = "/images/Stashlyavataricon.webp";
  
  // Use provided token/apiKey first, then environment variable as fallback
  const simliToken = token || env.SIMLI_AVATAR_TOKEN || "";
  const simliApiKey = apiKey || env.SIMLI_API_KEY || "";

  useEffect(() => {
    console.log("SimliAvatar component mounted");
    
    // Define the initWidget function first before using it
    const initWidget = () => {
      if (containerRef.current) {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        console.log("Initializing Simli widget with token:", simliToken ? "Token exists" : "No token");
        console.log("API key status:", simliApiKey ? "API key exists" : "No API key");
        
        if (!simliToken) {
          setError("Simli token is missing. Please check if it's properly provided.");
          return;
        }
        
        try {
          // Create the widget element
          const simliWidget = document.createElement('simli-widget');
          simliWidget.setAttribute('token', simliToken);
          simliWidget.setAttribute('agentid', agentId);
          simliWidget.setAttribute('position', 'relative');
          simliWidget.setAttribute('customtext', customText);
          simliWidget.setAttribute('customimage', customImageUrl);
          
          // Add API key if available
          if (simliApiKey) {
            simliWidget.setAttribute('apikey', simliApiKey);
          }
          
          // Store reference to the widget
          widgetRef.current = simliWidget;
          
          // Append the widget to the container
          containerRef.current.appendChild(simliWidget);
          console.log("Simli widget appended to container");
        } catch (err) {
          console.error("Error creating Simli widget:", err);
          setError(`Error creating Simli widget: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    };
    
    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      console.log("Received Simli message:", event.detail);
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

    // Also listen for error events from Simli
    const handleSimliError = (event: CustomEvent) => {
      console.error('Simli error event:', event);
      if (event.detail && event.detail.error) {
        console.error('Simli error detail:', event.detail.error);
        setError(`Simli error: ${event.detail.error}`);
      }
    };
    
    window.addEventListener('simli:error' as any, handleSimliError as EventListener);

    // Check if the Simli script is already in the document
    const existingScript = document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]');
    
    if (!existingScript) {
      console.log("Adding Simli script to document");
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      script.onload = () => {
        console.log("Simli script loaded successfully");
        initWidget();
      };
      script.onerror = (e) => {
        console.error("Error loading Simli script:", e);
        setError("Failed to load Simli script. Please check your internet connection.");
      };
      document.body.appendChild(script);
    } else {
      console.log("Simli script already exists in document");
      // Small delay to ensure script is fully initialized
      setTimeout(initWidget, 100);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
      window.removeEventListener('simli:error' as any, handleSimliError as EventListener);
      if (widgetRef.current && widgetRef.current.parentNode) {
        widgetRef.current.parentNode.removeChild(widgetRef.current);
      }
      widgetRef.current = null;
      setError(null);
    };
  }, [simliToken, simliApiKey, agentId, onMessageReceived, customText]);

  return (
    <div className="relative">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 max-w-[300px] text-sm">
          {error}
        </div>
      )}
      <div 
        ref={containerRef}
        className="simli-widget-container" 
        data-testid="simli-avatar-container"
      >
        {/* Simli widget will be inserted here programmatically */}
      </div>
    </div>
  );
};
