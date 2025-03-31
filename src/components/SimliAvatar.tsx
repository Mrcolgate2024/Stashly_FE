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
  const simliToken = token || "gAAAAABn6nTH61P_cvu7wglJNwcWUbxO48ploMF_C_684qyTtpuyTeloFakAguJ9jcKE6MKSRHX2fn195B177-5U_xdg7egkW0ybDTHLeQ_nX4p8_97zlEim8IfgQi43ZaXhUuD9e2diIOctVj5fcYxO0kapA2Gj0ORCquPiE7d_33md4N-_XD1ucUARCWm4URO5cbNdNPXXBdCw03D0iKyw-XjMoKqDxn5tUBeoCmvI_DaLRFz_4nE3-3XOOaOILXB7Jw3xoe0ucXU84SH6X58jO-3a888RiS1qBEXAl1VmY5efPtVAXyZaAkAx2fBPhdqC31zagaAx0P5aEqTFcfUu7rW5YuLq-jIdSCHww6m2Oxw7Gl54SZ7_9Mf1tD6MfNqB1amNCsco1qWHLfYUt2QGtFQtlHiVAQ==";

  useEffect(() => {
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

    const handleSimliError = (event: CustomEvent) => {
      if (event.detail && event.detail.error) {
        console.error('Simli error:', event.detail.error);
        setError(`Simli error: ${event.detail.error}`);
      }
    };
    
    window.addEventListener('simli:error' as any, handleSimliError as EventListener);

    if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    const initWidget = () => {
      if (containerRef.current && !widgetRef.current) {
        containerRef.current.innerHTML = '';
        
        if (!simliToken) {
          setError("Simli token is missing. Please set the VITE_SIMLI_AVATAR_TOKEN environment variable.");
          return;
        }
        
        const simliWidget = document.createElement('simli-widget');
        simliWidget.setAttribute('token', simliToken);
        simliWidget.setAttribute('agentid', agentId);
        simliWidget.setAttribute('position', 'relative');
        simliWidget.setAttribute('customtext', customText);
        simliWidget.setAttribute('customimage', customImageUrl);
        
        widgetRef.current = simliWidget;
        
        containerRef.current.appendChild(simliWidget);
      }
    };

    const timeoutId = setTimeout(initWidget, 100);

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
