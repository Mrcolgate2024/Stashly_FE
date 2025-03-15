
import React, { useEffect, useRef, useState } from "react";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token?: string;
  agentId?: string;
  customText?: string;
  customImage?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  token = "gAAAAABn1ae7zXDiL35Wfha29N8pdsmaUyG1IQlJKMxDZfZzt0pk69Mwl-wvFWYhQhrm_wfCH-cv_e4etlyKwDmLEqAL3G6ejA_FuXhr_UGhKXdhGd5KVBEp_QXroIQKpUq1chDlwKIIGLuSzETIMnCcd5ysV6LJrRT76PUKX5CX1RSTAhql6wwoghelCLeXlSiEeU4svpe0T9Tsf41q3vTL0fzMr_c9aTntwml1qcQWXecXtewlBEQacK9qrH33NslTvjIJ_CGIEf3tntbTfFfUqLBOF7mM5KTUXb3PRwx2d4x2lDtLjBnhelMZyg0jNc6P7d59txJ7M05syDI8VMj3_c-pfGgvbzVJeYlT8dyIeVgf2un2mHRwI31AGXAXg_hF4xSLAcJL8FshQOZ2SrteQXCdIdeYAg==",
  agentId = "b36e9ae6-5a88-4235-9e7a-eab88fd52d7b",
  customText = "Financial Analyst",
  customImage = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to handle Simli message events
    const handleSimliMessage = (event: CustomEvent) => {
      console.log("Simli message received:", event.detail);
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

    // Function to initialize the Simli widget
    const initializeWidget = () => {
      if (!containerRef.current) {
        console.error("Container ref is null");
        setError("Container initialization failed");
        return;
      }

      try {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        // Create the widget element
        const simliWidget = document.createElement('simli-widget');
        simliWidget.setAttribute('token', token);
        simliWidget.setAttribute('agentid', agentId);
        simliWidget.setAttribute('position', 'relative');
        
        // Only set customImage if it has a value
        if (customImage) {
          simliWidget.setAttribute('customimage', customImage);
        }
        
        simliWidget.setAttribute('customtext', customText);
        
        // Append the widget to the container
        containerRef.current.appendChild(simliWidget);
        console.log("Simli widget initialized with:", { token, agentId, customText, customImage });
        setIsLoaded(true);
      } catch (err) {
        console.error("Error initializing Simli widget:", err);
        setError("Widget initialization failed");
      }
    };

    // Check if Simli script is loaded
    const checkScriptLoaded = () => {
      if (window.customElements && window.customElements.get('simli-widget')) {
        console.log("Simli script is already loaded, initializing widget");
        initializeWidget();
      } else {
        console.log("Waiting for Simli script to load...");
        // Try again after a short delay
        setTimeout(checkScriptLoaded, 500);
      }
    };

    // Start the initialization process
    checkScriptLoaded();

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
      console.log("Cleaned up Simli event listeners");
    };
  }, [token, agentId, onMessageReceived, customText, customImage]);

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10" ref={containerRef}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {!isLoaded && !error && (
        <div className="flex items-center justify-center p-4 bg-white/80 rounded-full shadow-md">
          <div className="loading-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};
