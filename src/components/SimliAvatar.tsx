import React, { useEffect, useRef, useState } from "react";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token?: string;
  agentId: string;
  customText?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  token,
  agentId,
  customText = "Financial Analyst",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const customImageUrl = "/images/Stashlyavataricon.webp";
  const simliToken = token || "gAAAAABn5E9hHziT9vgZlPMivuBTlaQKc7gxZJ-Ge5HLzWsMkOQaH8rAUEmJD41IO9QG3PBPYvDY8DyilcqqmYnyjhySad8oBrPwW4PCcfPBlat68XrAZfNH0_b8XjILGDCNXwbuj0l0JJ_PO6xqoQgNUzcUyASSf6KxxgLtzlCwCxUWag6Wgy02PYF76v-DN69mzltVpR3S0nSqcszvwRaQKehXT79EVyQB3qiXANpVsgiFfMuCUSFS86vGXRh649oBxxJ2a5pzKlen1-2Kwv8isQ4WVDfiBPXFcz3WV6-QeHGoYoTtxYcYKjBl3BIUmrIv4bQ83_snn2rz2cbqydnIOHsc0-1jCiyIWFXISRQknDmbHvBmj6HvVBsARkXgu1KiN4a1wKRHeCe2g5Q7n-0W4D8u9Gn5Hg==";

  useEffect(() => {
    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

    // Also listen for error events from Simli
    const handleSimliError = (event: CustomEvent) => {
      if (event.detail && event.detail.error) {
        console.error('Simli error:', event.detail.error);
        setError(`Simli error: ${event.detail.error}`);
      }
    };
    
    window.addEventListener('simli:error' as any, handleSimliError as EventListener);

    // Add the Simli script if it's not already present
    if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // Create and append the Simli widget to our container
    const initWidget = () => {
      if (containerRef.current && !widgetRef.current) {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        if (!simliToken) {
          setError("Simli token is missing. Please set the VITE_SIMLI_AVATAR_TOKEN environment variable.");
          return;
        }
        
        // Create the widget element
        const simliWidget = document.createElement('simli-widget');
        simliWidget.setAttribute('token', simliToken);
        simliWidget.setAttribute('agentid', agentId);
        simliWidget.setAttribute('position', 'relative');
        simliWidget.setAttribute('customtext', customText);
        simliWidget.setAttribute('customimage', customImageUrl);
        
        // Store reference to the widget
        widgetRef.current = simliWidget;
        
        // Append the widget to the container
        containerRef.current.appendChild(simliWidget);
      }
    };

    // Initialize widget after a short delay to ensure proper cleanup
    const timeoutId = setTimeout(initWidget, 100);

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
      window.removeEventListener('simli:error' as any, handleSimliError as EventListener);
      if (widgetRef.current && widgetRef.current.parentNode) {
        widgetRef.current.parentNode.removeChild(widgetRef.current);
      }
      widgetRef.current = null;
      clearTimeout(timeoutId);
      setError(null);
    };
  }, [simliToken, agentId, onMessageReceived, customText]);

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 max-w-[300px] text-sm">
          {error}
        </div>
      )}
      <div ref={containerRef}>
        {/* Simli widget will be inserted here programmatically */}
      </div>
    </div>
  );
};
