
import React, { useEffect, useRef } from "react";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  token,
  agentId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:message' as any, handleSimliMessage as EventListener);

    // Create and append the Simli widget to our container
    if (containerRef.current) {
      const simliWidget = document.createElement('simli-widget');
      simliWidget.setAttribute('token', token);
      simliWidget.setAttribute('agentid', agentId);
      simliWidget.setAttribute('position', 'right'); // Position to right
      
      // Clear any existing content and append the widget
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(simliWidget);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
    };
  }, [token, agentId, onMessageReceived]);

  return (
    <div className="fixed bottom-4 right-4" ref={containerRef}>
      {/* Simli widget will be inserted here */}
    </div>
  );
};
