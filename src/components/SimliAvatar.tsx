
import React, { useRef, useEffect } from "react";
import { useSimliAvatar } from "@/hooks/useSimliAvatar";
import { createSimliWidget, safelyRemoveWidget } from "@/utils/simliUtils";
import { AvatarButton } from "./AvatarButton";
import { AvatarContainer } from "./AvatarContainer";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  token: initialToken,
  agentId,
  customText = "Financial Analyst",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";
  
  // Hard-coded valid token from user
  const VALID_TOKEN = "gAAAAABn0WgrjDfB13EKqTvpj6ZEZvNhO9E7mLXtZM7Y2RRFmZAgOkcERx38gkK8TCoAA0B8pXFH2MUCghd18QA0aMxreVeKdbIiGKzTpY0L_zSke0CVqw1VFttwGf0SsN2KDJJVTcStqGcqRYqMjorHlzn3Nf7UWc_BTJQKyVzNluSH0xSzCV7mqnNyEFxQtBwYuZNhWt-GIQTCelp3bvyfxns4OaZ4aJ96hDxV_0XsOF3XLVXKNoXikMCGYl9FvnXG5t68WoCYnJUoBMCVW8WKfeOcpbF8dPk4vW0kPFVGv9W1WSnyh--s3dtSe2YRQth3CRntHujSc9w2SI-oexNMYNSsA7zaDYX0nMccHYBrt2grvhbZmVVMhB4wyoaPIp-EopN1umJmPt-CYfzZGmxoThRRLkZAMPQCbHxrvTCxAUaedjxvENty8qlJdvahdzTN9NIBAOSI8gmGmMV96UCDDiT9L6Q7E7R-ZkyDm8YCaYntvve5DKQ_2cieYqEkhhnXrRia6AMj";

  const {
    isActivated,
    hasError,
    errorMessage,
    isProcessing,
    initialize,
    retryInitialization,
    updateContainerRef
  } = useSimliAvatar({
    token: VALID_TOKEN,
    agentId,
    position: 'right',
    eventName: 'simli:financial:message',
    customText,
    customImage: customImageUrl,
    onMessageReceived
  });

  // Create the widget when activated
  useEffect(() => {
    if (isActivated && containerRef.current) {
      try {
        // First safely remove any existing widget
        safelyRemoveWidget(containerRef);
        
        // Then create a new one
        createSimliWidget(
          containerRef,
          VALID_TOKEN,
          agentId,
          'right',
          'simli:financial:message',
          customText,
          customImageUrl
        );
        console.log(`${customText} avatar widget added to DOM`);
      } catch (err) {
        console.error(`Error creating ${customText} widget:`, err);
      }
    }
    
    // Cleanup when component unmounts or deactivates
    return () => {
      if (containerRef.current) {
        safelyRemoveWidget(containerRef);
      }
    };
  }, [isActivated, agentId, customText]);

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10">
      {!isActivated ? (
        <AvatarButton
          onClick={initialize}
          isProcessing={isProcessing}
          bgColor="bg-blue-500"
          hoverColor="hover:bg-blue-600"
          imageUrl={customImageUrl}
          altText={customText}
        />
      ) : (
        <AvatarContainer
          hasError={hasError}
          errorMessage={errorMessage}
          onRetry={retryInitialization}
          isProcessing={isProcessing}
          containerRef={containerRef}
          updateContainerRef={updateContainerRef}
        />
      )}
    </div>
  );
};
