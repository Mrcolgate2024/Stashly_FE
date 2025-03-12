
import React, { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { useSimliAvatar } from "@/hooks/useSimliAvatar";
import { createSimliWidget } from "@/utils/simliUtils";
import { SimliErrorMessage } from "./SimliErrorMessage";

interface MarketAnalystAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
}

export const MarketAnalystAvatar: React.FC<MarketAnalystAvatarProps> = ({
  onMessageReceived,
  token: initialToken,
  agentId,
  customText = "Market Analyst",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hard-coded valid token from user
  const VALID_TOKEN = "gAAAAABn0WhoVTdSnRpLy7op0O79gAka6U1SfH7GCpjx-dIc37msMAii2eFpvsrwKqANei9SvQOY1GDN1QiSqF-AkIwxRvnsw82_6chiyQ2YT1jiAQkZtmsJidt_Wq2aIwZFRcwtUpaqoKBExOGmwvv7Et2Av-AQV9VFMyjiph_X6QGcHraeVUgGIRc_cSIMCvKCv4apFOMgv8onii6wiWVcItyhXl0ebMhlRVOX7O1XU4S1kTXV27LkXuTrDmMAFK7MkxV9mwV6XEqylxl_N8qaVvh_578hVHIsk1PRDkQfJ14ZVONwmt45w3o8xOpvFithxj8C4eS3XywkVTG9JKG9EbbHIUpoll_xbR2kg0Qz2vgjGEdkS_npQHK9ayVXUNhQW3bMwBP2Tlnxg2iF3Wv7y5t7Q01jQgaa2cZVvMIiZ3BQmpjCZrCxbDaBagCpG1Zzn4EeHz_QCACKFax6AAzGB0YdW8uO0pq_2PvBon2pcLnE91Jng21Y3GJTL2bxmFaI9P-fnY9d";

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
    position: 'left',
    eventName: 'simli:market:message',
    customText,
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
          'left',
          'simli:market:message',
          customText
        );
        console.log(`${customText} avatar widget added to DOM`);
      } catch (err) {
        console.error(`Error creating ${customText} widget:`, err);
      }
    }
  }, [isActivated, agentId, customText]);

  return (
    <div className="fixed bottom-[80px] left-4 sm:bottom-10 sm:left-10 z-10">
      {!isActivated ? (
        <Button 
          onClick={initialize}
          className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors"
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
              <span className="text-xl font-bold">MA</span>
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
