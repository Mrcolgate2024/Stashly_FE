import React, { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { useSimliAvatar } from "@/hooks/useSimliAvatar";
import { createSimliWidget } from "@/utils/simliUtils";
import { SimliErrorMessage } from "./SimliErrorMessage";

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
    retryInitialization
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
  }, [isActivated, agentId, customText]);

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10">
      {!isActivated ? (
        <Button 
          onClick={initialize}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src={customImageUrl} 
                alt={customText} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                }}
              />
            </div>
          )}
        </Button>
      ) : (
        <div className="relative">
          {hasError && (
            <SimliErrorMessage 
              message={errorMessage}
              onRetry={retryInitialization}
              isProcessing={isProcessing}
            />
          )}
          <div ref={containerRef} className="min-h-[60px] min-w-[60px] bg-gray-100/30 rounded-full">
            {/* Simli widget will be inserted here programmatically */}
          </div>
        </div>
      )}
    </div>
  );
};
