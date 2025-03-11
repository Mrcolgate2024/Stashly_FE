
import React, { useEffect, useRef } from "react";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
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
  const customImageUrl = "/lovable-uploads/2af87563-98f9-4538-9187-851b2bc1dc30.png";

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
      simliWidget.setAttribute('customimage', customImageUrl); // Set custom image
      simliWidget.setAttribute('customtext', customText); // Set custom text
      
      // Clear any existing content and append the widget
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(simliWidget);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('simli:message' as any, handleSimliMessage as EventListener);
    };
  }, [token, agentId, onMessageReceived, customText]);

  return (
    <div className="fixed bottom-20 right-4" ref={containerRef}>
      {/* Simli widget will be inserted here */}
    </div>
  );
};
