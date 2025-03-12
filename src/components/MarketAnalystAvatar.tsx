
import React, { useRef, useEffect } from "react";
import { useSimliAvatar } from "@/hooks/useSimliAvatar";
import { createSimliWidget, safelyRemoveWidget } from "@/utils/simliUtils";
import { AvatarButton } from "./AvatarButton";
import { AvatarContainer } from "./AvatarContainer";

interface MarketAnalystAvatarProps {
  onMessageReceived: (message: string) => void;
  agentId: string;
  customText?: string;
}

export const MarketAnalystAvatar: React.FC<MarketAnalystAvatarProps> = ({
  onMessageReceived,
  agentId,
  customText = "Market Analyst",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hard-coded valid token with unique name for Market Analyst
  const MARKET_ANALYST_TOKEN = "gAAAAABn0WhoVTdSnRpLy7op0O79gAka6U1SfH7GCpjx-dIc37msMAii2eFpvsrwKqANei9SvQOY1GDN1QiSqF-AkIwxRvnsw82_6chiyQ2YT1jiAQkZtmsJidt_Wq2aIwZFRcwtUpaqoKBExOGmwvv7Et2Av-AQV9VFMyjiph_X6QGcHraeVUgGIRc_cSIMCvKCv4apFOMgv8onii6wiWVcItyhXl0ebMhlRVOX7O1XU4S1kTXV27LkXuTrDmMAFK7MkxV9mwV6XEqylxl_N8qaVvh_578hVHIsk1PRDkQfJ14ZVONwmt45w3o8xOpvFithxj8C4eS3XywkVTG9JKG9EbbHIUpoll_xbR2kg0Qz2vgjGEdkS_npQHK9ayVXUNhQW3bMwBP2Tlnxg2iF3Wv7y5t7Q01jQgaa2cZVvMIiZ3BQmpjCZrCxbDaBagCpG1Zzn4EeHz_QCACKFax6AAzGB0YdW8uO0pq_2PvBon2pcLnE91Jng21Y3GJTL2bxmFaI9P-fnY9d";

  const {
    isActivated,
    hasError,
    errorMessage,
    isProcessing,
    initialize,
    retryInitialization,
    updateContainerRef
  } = useSimliAvatar({
    token: MARKET_ANALYST_TOKEN,
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
        // First safely remove any existing widget
        safelyRemoveWidget(containerRef);
        
        // Then create a new one
        createSimliWidget(
          containerRef,
          MARKET_ANALYST_TOKEN,
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
    
    // Cleanup when component unmounts or deactivates
    return () => {
      if (containerRef.current) {
        safelyRemoveWidget(containerRef);
      }
    };
  }, [isActivated, agentId, customText]);

  return (
    <div className="fixed bottom-[80px] left-4 sm:bottom-10 sm:left-10 z-10">
      {!isActivated ? (
        <AvatarButton
          onClick={initialize}
          isProcessing={isProcessing}
          bgColor="bg-green-500"
          hoverColor="hover:bg-green-600"
          initials="MA"
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
