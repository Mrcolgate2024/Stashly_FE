
import React from "react";
import { BaseAvatar } from "./BaseAvatar";

interface RogueTraderAvatarProps {
  onMessageReceived: (message: string) => void;
  onError?: (error: string) => void;
  agentId: string;
  customText?: string;
}

export const RogueTraderAvatar: React.FC<RogueTraderAvatarProps> = ({
  onMessageReceived,
  onError,
  agentId,
  customText = "Rogue Trader",
}) => {
  const ROGUE_TRADER_TOKEN = "gAAAAABn0dQdmF79oMUVwfllwU1rwtv_JWPWSMfcHbCrkKOIvaxfAybLpw4QkxSx79-Yd_3-PMvzuBXcBi3wZkkZgqis_q7ZFF7POOeG3eS4qDeZQdOmaGUgrFkBeGtVKlNFM6EghyYqeIPtwUGT6iYear3xf7Ru1QGFgebG34KDN22HhyMM3x_J3njcx1njV_sz41l1TxDlET3HiyXLAPaS2aYChRIcd-QiCWD13jVzwu7qHHqgARAg9TcZu0-g87NeCCKUuVjg_6PKCnDIjphMUnn3XxRtlwBvZrz8RZAqYVoEqhzUZj-jYdzD3Mn-FBSywNOlb8fJSIt3Mg0WseiP5FlB_oaiaws5jOOZw2nreThji1ZDuRS7k1JFtpPv7ZnVz5uwNxHwq3SNraZl66zzUKm0zdhWZLg8VrsZvhYU63dR_D6ILG8AXTHX_npUdpmJazj4y7zg-224Pi2yhC6MwkKqz0TTw3SLkQi4jKb-jb047sqrJ1lM9DD7tAzo_t3bkQeL3fGR";

  // Create a wrapper for the onError callback
  const handleError = (error: string) => {
    console.error("Rogue Trader avatar error:", error);
    
    // Pass the error to the provided onError callback
    if (onError) {
      onError(error);
    }
  };

  return (
    <BaseAvatar
      onMessageReceived={onMessageReceived}
      onError={handleError}
      agentId={agentId}
      customText={customText}
      token={ROGUE_TRADER_TOKEN}
      eventName="simli:rogue:message"
      position="left"
      bgColor="bg-red-500"
      hoverColor="hover:bg-red-600"
      initials="RT"
      // Set disableTTS to false since this token should have TTS capabilities
      disableTTS={false}
    />
  );
};
