
import React from "react";
import { BaseAvatar } from "./BaseAvatar";

interface MarketAnalystAvatarProps {
  onMessageReceived: (message: string) => void;
  onError?: (error: string) => void;
  agentId: string;
  customText?: string;
}

export const MarketAnalystAvatar: React.FC<MarketAnalystAvatarProps> = ({
  onMessageReceived,
  onError,
  agentId,
  customText = "Market Analyst",
}) => {
  const MARKET_ANALYST_TOKEN = "gAAAAABn0WhoVTdSnRpLy7op0O79gAka6U1SfH7GCpjx-dIc37msMAii2eFpvsrwKqANei9SvQOY1GDN1QiSqF-AkIwxRvnsw82_6chiyQ2YT1jiAQkZtmsJidt_Wq2aIwZFRcwtUpaqoKBExOGmwvv7Et2Av-AQV9VFMyjiph_X6QGcHraeVUgGIRc_cSIMCvKCv4apFOMgv8onii6wiWVcItyhXl0ebMhlRVOX7O1XU4S1kTXV27LkXuTrDmMAFK7MkxV9mwV6XEqylxl_N8qaVvh_578hVHIsk1PRDkQfJ14ZVONwmt45w3o8xOpvFithxj8C4eS3XywkVTG9JKG9EbbHIUpoll_xbR2kg0Qz2vgjGEdkS_npQHK9ayVXUNhQW3bMwBP2Tlnxg2iF3Wv7y5t7Q01jQgaa2cZVvMIiZ3BQmpjCZrCxbDaBagCpG1Zzn4EeHz_QCACKFax6AAzGB0YdW8uO0pq_2PvBon2pcLnE91Jng21Y3GJTL2bxmFaI9P-fnY9d";

  return (
    <BaseAvatar
      onMessageReceived={onMessageReceived}
      onError={onError}
      agentId={agentId}
      customText={customText}
      token={MARKET_ANALYST_TOKEN}
      eventName="simli:market:message"
      position="left"
      bgColor="bg-green-500"
      hoverColor="hover:bg-green-600"
      initials="MA"
    />
  );
};
