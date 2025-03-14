
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
  // Update with the new token - using the same as Rogue Trader but with different agent ID
  const MARKET_ANALYST_TOKEN = "gAAAAABn0nnD3-eQwdpKNWyMWFAOJHvQ_T2tfnRpQIlscOX3-NZ0ZOjQdSXfRa-rP1V7HK6lBhV4mz-JPZseP4TNSSXlLvtxamDDkbL313b9gLmUpvZsUVkTt8Bf80r3rFc8bgYTAAHH1lKVeixWPHI4cG5CVnFUEp7BkZdFqH6kB6YNOQye1scUcz9ZtWmfmfnHjQIvKYHprtcam7K5JMpNsDMZJorriguO5FCtmhcp7rXa3aFLuZR8RG7uQBxtZpBmYeI39BmZ88VWkxfbuYXghD2ri_fpj0MxR3ruu1GkZDzl9ssrx41AcWwiw2WdJmB486qasXPa9iZQ2YtOl_m4bjfSzkHUr12Z_aDXGo2scRP1UHYuwLKGXh8O-KqgmwJDEtPFhGBroQ5f_lYgr2JMp6eMrKYfGfMbzxj-pS-b-B0dMYmUGRREatxxjlgvMY5IgtiNmquPZVsPt769GQrw20Mluwn7Fngs52Cp50uYng730b-ArNMDljapADQlvtrd2jeqcjbc";

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
      // Set disableTTS to true since we're getting TTS API Key errors
      disableTTS={true}
    />
  );
};
